import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-get-discount-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './get-discount-component.component.html',
  styleUrls: ['./get-discount-component.component.css']
})
export class GetDiscountComponentComponent {

  // List of discount types for the dropdown
  discount: any = [
    { value: 'centsOff', label: 'Cents Off' },
    { value: 'centsOff(perLb)', label: 'Cents Off (Per Lb)' },
    { value: 'pricePoint(items)', label: 'Price Point (Items)' },
    { value: 'pricePoint(perLb)', label: 'Price Point (Per Lb)' },
    { value: 'free', label: 'Free' },
    { value: 'percentOff', label: 'Percent Off' },
  ];

  discountForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  // Initializes the form when the component is created
  ngOnInit(): void {
    this.iniForm();
  }

  // Sets up the initial form structure with one store group version
  iniForm(): void {
    this.discountForm = this.fb.group({
      storeGroupVersions: this.fb.array([
        this.createStoreGroupVersion()
      ])
    });
  }

  // Creates a new form group for a store group version
  createStoreGroupVersion(): FormGroup {
    return this.fb.group({
      productGroupVersions: this.fb.array([
        this.createProductGroupVersion()
      ])
    });
  }

  // Creates a new form group for a product group version
  createProductGroupVersion(): FormGroup {
    return this.fb.group({
      productGroup: this.createProductFormGroup(),
      discountVersion: this.createDiscountFormGroup()
    });
  }

  // Creates a form group for product details
  createProductFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
      uom: ['item'],
    });
  }

  // Creates a form group for discount details
  createDiscountFormGroup(): FormGroup {
    return this.fb.group({
      discountType: ['pricePoint(items)'],
      amount: [''],
      upTo: [''],
      itemLimit: [''],
      perLbLimit: [''],
    });
  }

  // Retrieves the form array of store group versions
  get storeGroupVersionsControls(): FormArray {
    return this.discountForm.get('storeGroupVersions') as FormArray;
  }

  getProductGroupVersionsControls(storeIndex: number): FormArray {
    return this.storeGroupVersionsControls.at(storeIndex).get('productGroupVersions') as FormArray;
  }

  // Retrieves the form array of product group versions for a specific store group version
  addStoreGroupVersion(): void {
    this.storeGroupVersionsControls.push(this.createStoreGroupVersion());
  }

  // Copies data from the previous store group version to the current one
  copyFromPreviousStoreGroupVersion(currentIndex: number): void {
    // Ensure there is a previous version to copy from
    if (currentIndex > 0 && this.storeGroupVersionsControls.length > 1) {
      const previousIndex = currentIndex - 1;

      // Get the form group at the current index and the previous index
      const currentGroup = this.storeGroupVersionsControls.at(currentIndex) as FormGroup;
      const previousGroup = this.storeGroupVersionsControls.at(previousIndex) as FormGroup;

      // Copy values from the previous group to the current group
      currentGroup.patchValue(previousGroup.getRawValue());

      // Handle productGroupVersions
      const previousProductGroupVersions = previousGroup.get('productGroupVersions') as FormArray;
      const currentProductGroupVersions = currentGroup.get('productGroupVersions') as FormArray;

      // Clear the current productGroupVersions
      currentProductGroupVersions.clear();

      // Replicate the productGroupVersions from the previous group
      previousProductGroupVersions.controls.forEach(productGroupVersion => {
        // Clone the form group
        const clonedProductGroupVersion = this.createProductGroupVersion();
        clonedProductGroupVersion.patchValue((productGroupVersion as FormGroup).getRawValue());

        // Add the cloned form group to the current productGroupVersions
        currentProductGroupVersions.push(clonedProductGroupVersion);
      });
    }
  }

  // Adds a new product group version to a specific store group version
  addProductGroupVersion(storeIndex: number): void {
    const productGroupVersions = this.getProductGroupVersionsControls(storeIndex);
    productGroupVersions.push(this.createProductGroupVersion());
  }

  // Removes a product group version from a specific store group version
  removeProductGroupVersion(storeIndex: number, productGroupIndex: number): void {
    const productGroupVersions = this.getProductGroupVersionsControls(storeIndex);
    if (productGroupVersions.length > 1) {
      productGroupVersions.removeAt(productGroupIndex);
    }
  }

  // Handles changes in the discount type and updates validation rules accordingly
  discountHandler(event: any, storeIndex: number, productGroupIndex: number): void {
    const selectedValue = event.target.value;
    const control = this.getProductGroupVersionsControls(storeIndex).at(productGroupIndex).get('discountVersion');

    // Set validators for 'perLbLimit' based on the selected discount type
    if (selectedValue === 'centsOff(perLb)' || selectedValue === 'pricePoint(perLb)') {
      control?.get('perLbLimit')?.setValidators([Validators.required]);
    } else {
      control?.get('perLbLimit')?.clearValidators();
    }

    // Set validators for 'upTo' based on the selected discount type
    if (selectedValue === 'percentOff') {
      control?.get('upTo')?.setValidators([Validators.required]);
    } else {
      control?.get('upTo')?.clearValidators();
    }

    // Handle 'amount' field for 'free' discount type
    if (selectedValue === 'free') {
      control?.get('amount')?.clearValidators();
      control?.get('amount')?.setValue('');
    } else {
      control?.get('amount')?.setValidators([Validators.required, Validators.min(0)]);
    }

    // Update the validity of the fields
    control?.get('perLbLimit')?.updateValueAndValidity();
    control?.get('upTo')?.updateValueAndValidity();
    control?.get('amount')?.updateValueAndValidity();
  }

  // Determines whether to show the 'upTo' field based on the selected discount type
  showUpTo(storeIndex: number, productGroupIndex: number): boolean {
    const selectedValue = this.getProductGroupVersionsControls(storeIndex).at(productGroupIndex).get('discountVersion.discountType')?.value;
    return selectedValue === 'percentOff';
  }

  // Determines whether to show the 'perLbLimit' field based on the selected discount type
  showPerLbLimit(storeIndex: number, productGroupIndex: number): boolean {
    const selectedValue = this.getProductGroupVersionsControls(storeIndex).at(productGroupIndex).get('discountVersion.discountType')?.value;
    return selectedValue === 'centsOff(perLb)' || selectedValue === 'pricePoint(perLb)';
  }

  // Checks if the discount type is 'free'
  isFree(storeIndex: number, productGroupIndex: number): boolean {
    const selectedValue = this.getProductGroupVersionsControls(storeIndex).at(productGroupIndex).get('discountVersion.discountType')?.value;
    return selectedValue === 'free';
  }

  // Logs the form values to the console when the form is submitted
  onSubmit(): void {
    console.log(this.discountForm.value);
  }
}
