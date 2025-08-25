import { TestBed } from '@angular/core/testing';

import { SsrBannerService } from './ssr-banner-service';

describe('SsrBannerService', () => {
  let service: SsrBannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SsrBannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
