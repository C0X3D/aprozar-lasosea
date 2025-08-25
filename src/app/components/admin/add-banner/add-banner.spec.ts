import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBanner } from './add-banner';

describe('AddBanner', () => {
  let component: AddBanner;
  let fixture: ComponentFixture<AddBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
