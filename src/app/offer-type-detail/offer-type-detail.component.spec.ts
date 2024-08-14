import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferTypeDetailComponent } from './offer-type-detail.component';

describe('OfferTypeDetailComponent', () => {
  let component: OfferTypeDetailComponent;
  let fixture: ComponentFixture<OfferTypeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferTypeDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OfferTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
