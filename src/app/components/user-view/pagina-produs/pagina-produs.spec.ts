import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaProdus } from './pagina-produs';

describe('PaginaProdus', () => {
  let component: PaginaProdus;
  let fixture: ComponentFixture<PaginaProdus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaProdus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaProdus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
