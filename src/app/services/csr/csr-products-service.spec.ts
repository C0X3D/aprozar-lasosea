import { TestBed } from '@angular/core/testing';

import { CsrProductsService } from './csr-products-service';

describe('CsrProductsService', () => {
  let service: CsrProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsrProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
