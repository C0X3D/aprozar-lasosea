import { inject, PLATFORM_ID, InjectionToken, Provider } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ProductsServiceInterface } from '../interfaces/ProductsServiceInterface';
import { CsrProductsService } from '../csr/csr-products-service';
import { SsrProductsService } from '../ssr/ssr-products-service';


/**
 * InjectionToken for ProductsServiceInterface
 */
export const PRODUCTS_SERVICE = new InjectionToken<ProductsServiceInterface>('ProductsServiceInterface');

/**
 * Provider that auto-injects SSR/CSR service
 */
export const ProductsServiceProvider: Provider = {
  provide: PRODUCTS_SERVICE,
  useFactory: () => {
    const platformId = inject(PLATFORM_ID);
    if (isPlatformServer(platformId)) {
      console.log('[ProductsServiceProvider] Using SSR service');
      return inject(SsrProductsService);
    } else {
      console.log('[ProductsServiceProvider] Using CSR service');
      return inject(CsrProductsService);
    }
  },
  deps: [PLATFORM_ID, SsrProductsService, CsrProductsService],
};
