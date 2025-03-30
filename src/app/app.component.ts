import { Component, computed, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { PictureGridComponent } from './picture-grid/picture-grid.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, FormsModule, MatFormFieldModule, MatSelectModule, CommonModule, ReactiveFormsModule, PictureGridComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  // Form group for adoption form
  adoptionForm: FormGroup;

  // List of color options
  colours = ['White', 'Black', 'Brown', 'Golden', 'Gray', 'Mixed'];
  
  // UI state variables
  loading = false;
  public submitted = false;
  
  // Data for breeds fetched from API
  public birds: any;

  // Title of the application
  title = 'mizrachi';
  
  // Selected breed
  selected = '';
  
  // Injecting HttpClient for API calls
  http = inject(HttpClient);
  
  // Subscription to handle observables
  subscriptions: Subscription = new Subscription();
  
  // List of dog breeds and their sub-breeds
  breeds: { name: string; subBreeds: string[] }[] = [];
  
  // Selected breed name
  selectedBreed: string = '';
  
  // Number of displayed breeds
  displayCount: number = 10;
  
  // Filtered list of displayed breeds
  filteredBreeds: { name: string; subBreeds: string[] }[] = [];
  
  // Selected breed image URL
  selectedBreedImage: string = '';

  constructor(private fb: FormBuilder) {
    // Fetching breeds list from API
    this.http.get('https://dog.ceo/api/breeds/list/all').subscribe((r) => {
      this.birds = r;
      console.log(r);
      const breedsWithSubBreeds = [];
      const breedsData = this.birds.message;
      for (const breed in breedsData) {
        if (breedsData.hasOwnProperty(breed) && breedsData[breed].length > 0) {
          breedsWithSubBreeds.push(breed);
        }
      }
      this.birds = breedsWithSubBreeds;
    });

    // Initializing the form with validation
    this.adoptionForm = this.fb.group({
      weight: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      colour: ['', Validators.required],
      firstAdoption: [false],
      age: ['', [Validators.required, Validators.min(0), Validators.max(20)]]
    });
    
    // Dynamically update age validation based on first adoption checkbox
    this.subscriptions.add(
      this.adoptionForm.get('firstAdoption')?.valueChanges.pipe(
        tap((firstAdoption) => {
          const ageControl = this.adoptionForm!.get('age');
          ageControl?.setValidators([Validators.required, Validators.min(0), Validators.max(firstAdoption ? 8 : 20)]);
          ageControl?.updateValueAndValidity();
        })
      ).subscribe()
    );
  }

  // Lifecycle hook: Called after component initialization
  ngOnInit() {
    this.fetchBreeds();
  }

  // Fetch the list of dog breeds from API
  fetchBreeds() {
    this.http.get<{ message: Record<string, string[]>, status: string }>('https://dog.ceo/api/breeds/list/all')
      .subscribe(response => {
        this.breeds = Object.entries(response.message)
          .filter(([_, subBreeds]) => subBreeds.length > 0)
          .map(([name, subBreeds]) => ({ name, subBreeds }));

        this.updateDisplayedBreeds();
      });
  }

  // Updates the displayed breeds list
  updateDisplayedBreeds() {
    this.filteredBreeds = this.breeds.slice(0, this.displayCount);
  }

  // Handles breed selection and fetches a random image of the selected breed
  onBreedSelect() {
    if (this.selectedBreed) {
      const breedFormatted = this.selectedBreed.toLowerCase();
      this.http.get<{ message: string; status: string }>(`https://dog.ceo/api/breed/${breedFormatted}/images/random`)
        .subscribe(response => {
          this.selectedBreedImage = response.message;
        });
    }
  }
  selectedValue: string | undefined;
  onSelectionChange(event: MatSelectChange) {
    console.log('Selected value:', event.value);
    // Perform any other actions you need here
  }

  // Returns appropriate error messages for form validation
  getErrorMessage(control: string): string {
    const formControl = this.adoptionForm!.get(control);
    if (formControl?.hasError('required')) return 'This field is required';
    if (formControl?.hasError('min')) return `Value must be at least ${formControl.errors?.['min'].min}`;
    if (formControl?.hasError('max')) return `Value must be at most ${formControl.errors?.['max'].max}`;
    return '';
  }

  // Handles form submission
  onSubmit() {
    if (this.adoptionForm!.valid) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.submitted = true;
      }, 2000);
    }
  }

  // Lifecycle hook: Called before component is destroyed
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
