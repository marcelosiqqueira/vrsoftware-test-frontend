import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environments';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsolute = /^https?:\/\//i.test(req.url);
  const url = isAbsolute
    ? req.url
    : `${environment.apiBaseUrl.replace(/\/$/, '')}/${req.url.replace(
        /^\//,
        ''
      )}`;

  const cloned = req.clone({
    url,
    setHeaders: { 'Content-Type': 'application/json' },
  });

  return next(cloned);
};
