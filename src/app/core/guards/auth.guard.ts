import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export function possuiToken(token: string | null): boolean {
  return Boolean(token);
}

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (possuiToken(token)) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};
