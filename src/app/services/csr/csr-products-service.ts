import { Injectable } from '@angular/core';
import {
  addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc
} from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { Product } from '../../models/product';
import { db, storage } from '../../firebase.config';
import {
  getDownloadURL, ref, uploadBytes, type StorageReference
} from 'firebase/storage';
import type { FirebaseError } from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class CsrProductsService {
  getCommonTagsOnce(): Observable<string[]> {
    const ref = doc(db, 'metadata', 'tags');
    return from(getDoc(ref)).pipe(
      map(snap => (snap.exists() ? (snap.data()['all'] as string[]) ?? [] : []))
    );
  }

  // // realtime no need to subscribe
    // just testign
  // getCommonTags(): Observable<string[]> {
  //   const ref = doc(db, 'metadata', 'tags');
  //   return new Observable<string[]>(subscriber => {
  //     const unsub = onSnapshot(
  //       ref,
  //       snap => subscriber.next((snap.data()?.['all'] as string[]) ?? []),
  //       err => subscriber.error(err)
  //     );
  //     return unsub; // cleanup
  //   });
  // }

  private collectionRef = collection(db, 'products');

  getAllProducts(): Observable<Product[]> {
    return from(getDocs(this.collectionRef)).pipe(
      map(snapshot => snapshot.docs.map(d => ({ ...(d.data() as Product), id: d.id }))),
      map(list => list.sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999)))
    );
  }

  async addNewProduct(product: Product): Promise<string> {
    const docRef = await addDoc(this.collectionRef, product);
    await this.updateTagList(product.tags?.split(',') ?? []);
    return docRef.id;
  }

  private normalizeTags(tags: string[]): string[] {
    return Array.from(new Set(tags.map(t => t.trim().toLowerCase()).filter(Boolean)));
  }

  async updateTagList(newTags: string[]): Promise<void> {
    const tagsRef = doc(db, 'metadata', 'tags');
    const snap = await getDoc(tagsRef);
    const current: string[] = snap.exists() ? (snap.data()['all'] ?? []) : [];
    const merged = Array.from(new Set([...current, ...this.normalizeTags(newTags)]));
    await setDoc(tagsRef, { all: merged });
  }

  /** Helper: sleep */
  private sleep(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms));
  }

  /** Helper: retry getDownloadURL cu timeout & backoff */
  private async getUrlWithRetry(
    storageRef: StorageReference,
    opts: { maxAttempts?: number; initialDelayMs?: number; backoffFactor?: number; timeoutPerAttemptMs?: number } = {}
  ): Promise<string> {
    const {
      maxAttempts = 10,
      initialDelayMs = 600,
      backoffFactor = 1.7,
      timeoutPerAttemptMs = 3500
    } = opts;

    let delay = initialDelayMs;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const url = await Promise.race<string>([
          getDownloadURL(storageRef),
          new Promise<string>((_, rej) => setTimeout(() => rej(new Error('timeout')), timeoutPerAttemptMs))
        ]);
        return url;
      } catch (e) {
        const err = e as Partial<FirebaseError> | Error;
        const code = (err as Partial<FirebaseError>)?.code;
        const isNotFound = code === 'storage/object-not-found';
        const isTimeout = err instanceof Error && err.message === 'timeout';

        if (attempt === maxAttempts || (!isNotFound && !isTimeout)) throw e;
        await this.sleep(delay);
        delay = Math.ceil(delay * backoffFactor);
      }
    }
    throw new Error('Exhausted retries for getDownloadURL');
  }

  /** Upload + așteaptă thumbnail-ul generat de funcția Firebase */
  async uploadImage(
    file: File,
    newFileName: string
  ): Promise<{ imageUrl: string; thumbnailUrl: string | null }> {
    // Dacă funcția ta generează JPEG la thumb, păstrează ".jpeg" la thumbRef.
    const originalExt = /\.([a-z0-9]+)$/i.exec(file.name)?.[1]?.toLowerCase() ?? 'jpg';

    const originalRefName = `products/${newFileName}.${originalExt}`;
    // ADAPTEAZĂ asta exact la naming-ul funcției tale (folder + sufix + extensie):
    const thumbRefName = `products/thumbnails/${newFileName}_600x600.jpeg`;

    const originalRef = ref(storage, originalRefName);

    const snap = await uploadBytes(originalRef, file, {
      contentType: file.type || `image/${originalExt}`
    });

    const imageUrl = await getDownloadURL(snap.ref);

    // Thumbnail poate întârzia — încercăm cu retry+timeout.
    try {
      const thumbnailUrl = await this.getUrlWithRetry(ref(storage, thumbRefName), {
        maxAttempts: 10,
        initialDelayMs: 700,
        backoffFactor: 1.6,
        timeoutPerAttemptMs: 3500
      });
      return { imageUrl, thumbnailUrl };
    } catch {
      // Nu blocăm flow-ul dacă thumb nu e gata; UI poate face polling ulterior.
      return { imageUrl, thumbnailUrl: null };
    }
  }

  getProductById(id: string): Observable<Product> {
    return from(getDoc(doc(db, 'products', id))).pipe(
      map(snap => {
        if (!snap.exists()) throw new Error('Produsul nu există');
        return { ...(snap.data() as Partial<Product>), id: snap.id } as Product;
      })
    );
  }
}
