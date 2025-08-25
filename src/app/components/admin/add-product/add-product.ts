import { Component } from '@angular/core';
import { LucideAngularModule } from "lucide-angular";
import { Product } from '../../../models/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CsrProductsService } from '../../../services/csr/csr-products-service';
import { v4 as uuidv4 } from "uuid";
import { FilterDict } from '../../../models/filterDict';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-product',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})
export class AddProduct {
  product: Product = {} = Object.create(null);
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  sortTypes = FilterDict.sortTypes;
  commonTags$: Observable<string[]>;
  constructor(private productService: CsrProductsService) {

    this.commonTags$ = this.productService.getCommonTagsOnce();
  }

  openCamera() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }



  toggleTag(tag: string): void {
    // Obține array curent de taguri, indiferent dacă există deja
    const currentTags = this.product.tags?.split(',')
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0) ?? [];

    const lowerTag = tag.toLowerCase();
    const tagIndex = currentTags.indexOf(lowerTag);

    if (tagIndex === -1) {
      // ➕ Adaugă tag dacă nu există
      currentTags.push(lowerTag);
    } else {
      // ➖ Elimină tag dacă există
      currentTags.splice(tagIndex, 1);
    }

    // Salvează în `this.product.tags` ca string cu virgulă
    this.product.tags = currentTags.join(', ');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  isTagSelected(tag: string): boolean {
    return this.product.tags?.toLowerCase()
    .split(',')
    .map(t => t.trim())
    .includes(tag.toLowerCase()) ?? false;
  }

  async save(): Promise<void> {
    // optional: show UI state
    // this.isSaving = true;

    try {
      if (this.selectedFile) {
        // prefer native randomUUID if available
        const fileId = (globalThis.crypto?.randomUUID?.() ?? uuidv4());
        const imageData = await this.productService.uploadImage(this.selectedFile, fileId);

        if (imageData) {
          this.product.imageUrl = imageData.imageUrl;
          this.product.thumbnailUrl = imageData.thumbnailUrl ?? '';
        }
      }

      await this.productService.addNewProduct(this.product);
      // optional: toast success
    } catch (err) {
      // optional: toast/log error
      console.error("Failed to save product:", err);
      throw err; // rethrow if caller handles it
    } finally {
      // this.isSaving = false;
    }
  }

}
