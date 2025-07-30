import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { provideNoopAnimations, provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { loaderInterceptor } from './Interceptors/loader.interceptor';
// import { providePrimeNG } from 'primeng/config';
// import Aura from '@primeuix/themes/aura'

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(withFetch(), withInterceptors([loaderInterceptor])), provideAnimations(), provideAnimationsAsync(), provideToastr({
    timeOut: 5000,
    positionClass: 'toast-top-right',
    preventDuplicates: true,
  })]
};
