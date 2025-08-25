import { Injectable } from '@angular/core';
import { collection, query, orderBy, onSnapshot, serverTimestamp, addDoc, updateDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { db, storage } from '../../firebase.config';
import { Banner } from '../../models/banner';
import { BannerServiceInterface } from '../interfaces/BannerServiceInterface';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export type CreateBanner = Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>;
@Injectable({
  providedIn: 'root'
})
export class CsrBannerService implements BannerServiceInterface {


  private bannersSubject = new BehaviorSubject<Banner[]>([]);
  banners$ = this.bannersSubject.asObservable();

  constructor() {
    this.listenToBanners();
  }

  getBanners(): Observable<Banner[]> {
    return this.banners$;
  }

  private collectionRef = collection(db, 'banners');

  async getAll(): Promise<Banner[]> {
    const q = query(this.collectionRef, orderBy('order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Banner, 'id'>) }));
  }

  async add(banner: Banner) {
    await addDoc(this.collectionRef, banner);
  }

  async update(id: string, data: Partial<Banner>) {
    const docRef = doc(db, 'banners', id);
    await updateDoc(docRef, data);
  }

  async delete(id: string) {
    const docRef = doc(db, 'banners', id);
    await deleteDoc(docRef);
  }

  async uploadImage(file: File): Promise<string> {
      const extension = file.name.split('.').pop(); // "png"
      const baseName = file.name.split('.').slice(0, -1).join('.'); // "poza"

      const fileRef = ref(storage, `banners/${baseName}_${Date.now()}.${extension}`);
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    }

  private listenToBanners() {
    const bannersCollection = collection(db, 'banners');
    const q = query(bannersCollection, orderBy('order'));

    onSnapshot(q, snapshot => {
      const banners: Banner[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Banner, 'id'>)
      }));
      this.bannersSubject.next(banners);
    });
  }
}
