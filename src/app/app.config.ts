import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxLeafletModule } from 'ngx-leaflet';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    NgxLeafletModule,
    importProvidersFrom(FormsModule)
]
};
