import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogProduse } from './catalog-produse';

describe('CatalogProduse', () => {
  let component: CatalogProduse;
  let fixture: ComponentFixture<CatalogProduse>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogProduse]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogProduse);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
