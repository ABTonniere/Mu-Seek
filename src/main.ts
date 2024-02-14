import { bootstrapApplication } from '@angular/platform-browser';
import { appMain } from './app/app.Main';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appMain)
  .catch((err) => console.error(err));
