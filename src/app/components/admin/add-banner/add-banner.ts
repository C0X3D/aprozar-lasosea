import { Component } from '@angular/core';
import { Banner } from '../../../models/banner';
import { CsrBannerService } from '../../../services/csr/csr-banner-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-banner',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-banner.html',
  styleUrl: './add-banner.scss'
})
export class AddBanner {
banners: Banner[] = [];
  newBanner: Banner = { title: '', description: '', imageUrl: '', order: 0, backgroundColor:'#f0f0f0' };
  editId: string | null = null;

  constructor(private bannerService: CsrBannerService){

  }

  async ngOnInit() {
    await this.loadBanners();
  }

  async loadBanners() {
    this.banners = await this.bannerService.getAll();
  }

  async save() {
    if (this.editId) {
      await this.bannerService.update(this.editId, this.newBanner);
    } else {
      await this.bannerService.add(this.newBanner);
    }
    this.resetForm();
    await this.loadBanners();
  }

  edit(banner: Banner) {
    this.newBanner = { ...banner };
    this.editId = banner.id ?? null;
  }

  async delete(id: string | undefined) {
    if (id) {
      await this.bannerService.delete(id);
      await this.loadBanners();
    }
  }

  resetForm() {
    this.newBanner = { title: '', description: '', imageUrl: '', order: 0, backgroundColor:'#f0f0f0f0' };
    this.editId = null;
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newBanner.imageUrl = await this.bannerService.uploadImage(file);
    }
  }
}
