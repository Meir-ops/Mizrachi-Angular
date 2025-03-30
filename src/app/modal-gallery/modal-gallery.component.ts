import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-modal-gallery',
  imports: [GalleryModule],
  standalone: true,
  templateUrl: './modal-gallery.component.html',
  styleUrl: './modal-gallery.component.scss'
})
export class ModalGalleryComponent {
  // Array to store images as gallery items
  public birds: GalleryItem[] = [];
  
  // Variable to store API response
  photos: any;
  
  // Inject HttpClient for making API requests
  http = inject(HttpClient);
  
  constructor() {
    // Fetch images of the 'hound' breed from the API
    this.http.get('https://dog.ceo/api/breed/hound/images').subscribe((r) => {
      this.photos = r;
      
      // Convert API response to JSON string and parse it back to an object
      const t = JSON.stringify(r);
      const tt = JSON.parse(t);
      
      // Loop through the image URLs and add them to the gallery
      for (let i = 0; i < tt.message.length; i++) {
        this.birds.push(new ImageItem({ src: this.photos.message[i], thumb: this.photos.message[i] }));
      }
      
      // Log API response to console
      console.log(r);
    });
  }
}

