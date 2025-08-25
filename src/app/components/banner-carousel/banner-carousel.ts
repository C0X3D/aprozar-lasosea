import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { BannerServiceInterface } from '../../services/interfaces/BannerServiceInterface';
import { Banner } from '../../models/banner';
import { BANNER_SERVICE } from '../../services/tokens/banner-service.token';

@Component({
  selector: 'app-banner-carousel',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './banner-carousel.html',
  styleUrl: './banner-carousel.scss'
})
export class BannerCarousel {
  private bannerService = inject<BannerServiceInterface>(BANNER_SERVICE);

  banners = toSignal(this.bannerService.getBanners(), { initialValue: [] as Banner[] });
  currentIndex = signal(0);
  autoRotate: any;
  private platformId = inject(PLATFORM_ID);
  constructor() {
    console.log('BannerCarousel constructed');
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoRotate();
    }
  }

  startAutoRotate() {
    this.autoRotate = setInterval(() => {
      this.next();
    }, 5000); // slide la fiecare 5 secunde
  }

  stopAutoRotate() {
    clearInterval(this.autoRotate);
  }

  next() {
    const count = this.banners().length;
    if (count > 0) {
      this.currentIndex.set((this.currentIndex() + 1) % count);
    }
  }

  prev() {
    const count = this.banners().length;
    if (count > 0) {
      this.currentIndex.set((this.currentIndex() - 1 + count) % count);
    }
  }
}
