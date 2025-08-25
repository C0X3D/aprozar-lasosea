import { TestBed } from '@angular/core/testing';

import { CsrBannerService } from './csr-banner-service';

describe('CsrBannerService', () => {
  let service: CsrBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsrBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
