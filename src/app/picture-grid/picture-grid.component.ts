import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-picture-grid',
  templateUrl: './picture-grid.component.html',
  imports: [CommonModule],
  standalone: true,
  styleUrls: ['./picture-grid.component.css']
})
export class PictureGridComponent {
  colours = ['White', 'Black', 'Brown', 'Golden', 'Gray', 'Mixed'];
  loading = false;
  public submitted = false;
  public birds:any;
  title = 'mizrachi';
  selected = '';
  http = inject(HttpClient)
  breeds: { name: string; subBreeds: string[] }[] = [];
  selectedBreed: string = '';
  displayCount: number = 10;
  filteredBreeds: { name: string; subBreeds: string[] }[] = []
  selectedBreedImage: string = '';

  constructor(private dialog: MatDialog){
    
  }

  ngOnInit() {
    this.fetchBreeds();
  }

  fetchBreeds() {
    this.http.get<{ message: Record<string, string[]>, status: string }>('https://dog.ceo/api/breed/hound/images')
      .subscribe(r => {
        this.birds = r.message;
      });
  }

  selectedImage: string | null = null;
  isPopupVisible: boolean = false;

  showPopup(image: string): void {
    this.selectedImage = image;
    this.isPopupVisible = true;
    // Add the 'visible' class to trigger the animation
    setTimeout(() => {
      const overlay = document.querySelector('.popup-overlay');
      if (overlay) {
        overlay.classList.add('visible');
      }
    }, 0); // Use setTimeout to ensure the DOM is updated
  }

  closePopup(): void {
    // Remove the 'visible' class to start the fade-out
    const overlay = document.querySelector('.popup-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
    }
    setTimeout(() => {
      this.isPopupVisible = false;
      this.selectedImage = null;
    }, 300); // Wait for the transition to finish (adjust timing if needed)
  }
}