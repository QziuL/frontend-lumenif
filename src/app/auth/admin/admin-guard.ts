import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';
import {inject} from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (authService.isLoggedIn() && currentUser?.roles.some(role => role.name === 'ADMIN')) {
    return true; // Se está logado E tem o papel 'ADMIN', permite o acesso.
  }

  // Se não for admin, redireciona para alguma página ou "acesso negado"
  router.navigate(['/']);
  return false;
};
