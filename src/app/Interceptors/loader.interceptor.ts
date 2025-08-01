import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderServiceService } from '../Services/loader-service.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(LoaderServiceService);
  loader.show(); // comment
  return next(req).pipe(finalize(() => {loader.hide()}));
};
