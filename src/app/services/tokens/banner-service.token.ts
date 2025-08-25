import { inject, PLATFORM_ID, InjectionToken, Provider } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { BannerServiceInterface } from '../interfaces/BannerServiceInterface';
import { CsrBannerService } from '../csr/csr-banner-service';
import { SsrBannerService } from '../ssr/ssr-banner-service';

export const BANNER_SERVICE = new InjectionToken<BannerServiceInterface>('BannerServiceInterface');

export const BannerServiceProvider: Provider = {
  provide: BANNER_SERVICE,
  useFactory: () => {
    const platformId = inject(PLATFORM_ID);
    return isPlatformServer(platformId)
      ? inject(SsrBannerService)
      : inject(CsrBannerService);
  },
  deps: [PLATFORM_ID, SsrBannerService, CsrBannerService],
};
