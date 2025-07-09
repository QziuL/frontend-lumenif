import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';
import {inject} from '@angular/core';

export const creatorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if(currentUser) {
    if(currentUser.roles.some(role => role.name === 'CREATOR')) {
      return true;
    }
  }

  router.navigate(['/home']);
  return false;
};
