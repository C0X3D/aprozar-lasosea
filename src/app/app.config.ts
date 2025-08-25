import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ProductsServiceProvider } from './services/tokens/products-service.token';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { LucideAngularModule, Search, ArrowUp, ArrowDown, ListFilter, Share, Share2, CheckCircle, AlertTriangle, CameraIcon, Camera, ChevronRight, ChevronLeft } from 'lucide-angular';
import { BannerServiceProvider } from './services/tokens/banner-service.token';

export const appConfig: ApplicationConfig = {
  providers: [
    BannerServiceProvider,
    ProductsServiceProvider,
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(
      LucideAngularModule.pick({ Search, ArrowUp, ArrowDown, ListFilter, Share, Share2, CheckCircle, AlertTriangle, CameraIcon, Camera, ChevronRight, ChevronLeft })
    ),
    //provideClientHydration(withEventReplay())
  ]
};
