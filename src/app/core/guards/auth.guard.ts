import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export function possuiToken(token: string | null): boolean {
  return Boolean(token);
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (possuiToken(token)) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

