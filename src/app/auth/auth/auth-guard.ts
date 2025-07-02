import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../../services/auth/auth-service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // console.log('auth guard', route);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se o usuário está logado através do Service
  if (authService.isLoggedIn()) {
    return true; // Sim, pode acessar a rota
  }

  // Se não estiver logado, redireciona para a página de login
  console.log('Usuário não logado, redirecionando para /login');

  // Guarda a URL que o usuário tentou acessar para redirecioná-lo de volta depois
  const returnUrl = state.url;

  // Redireciona para a página de login, passando a returnUrl como um query parameter
  router.navigate(['/login'], {queryParams: {returnUrl: returnUrl}});

   return false; // Não, não pode acessar a rota
};

