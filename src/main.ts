import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // Import the function
import { provideHttpClient } from '@angular/common/http';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

  bootstrapApplication(AppComponent, {
    providers: [
      provideRouter([]), // Keep any existing providers, like routing
      provideAnimations(), // Add the animation provider here
      provideHttpClient()
      // Or, use one of the other providers instead:
      // provideAnimationsAsync()
      // provideNoopAnimations()
    ]
  }).catch(err => console.error(err));