import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';
import {inject} from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (currentUser) {
    // const rolesArray = Array.isArray(currentUser.roles) ? currentUser.roles : Object.values(currentUser.roles);

    // const rolesRaw = currentUser.roles;

    // console.log('É admin? ', currentUser.roles.some(role => role.name === 'ADMIN'));
    if (currentUser.roles.some(role => role.name === 'ADMIN')) {
      return true; // Se está logado E tem o papel 'ADMIN', permite o acesso.
    }
  }

  // Se não for admin, redireciona para alguma página ou "acesso negado"
  router.navigate(['/home']);
  return false;
};
