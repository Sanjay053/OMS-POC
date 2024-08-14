import { Component } from '@angular/core';
import { GetDiscountComponentComponent } from '../get-discount-component/get-discount-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-offer-type-detail',
  standalone: true,
  imports: [CommonModule, GetDiscountComponentComponent],
  templateUrl: './offer-type-detail.component.html',
  styleUrl: './offer-type-detail.component.css'
})
export class OfferTypeDetailComponent {

}
