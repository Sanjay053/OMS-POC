import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetDiscountComponentComponent } from './get-discount-component.component';

describe('GetDiscountComponentComponent', () => {
  let component: GetDiscountComponentComponent;
  let fixture: ComponentFixture<GetDiscountComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetDiscountComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GetDiscountComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
