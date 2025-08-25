import { TestBed } from '@angular/core/testing';

import { SsrProductsService } from './ssr-products-service';

describe('SsrProductsService', () => {
  let service: SsrProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsrProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
