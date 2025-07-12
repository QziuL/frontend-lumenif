import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth/auth-service';
import {catchError, throwError} from 'rxjs';
import {Router} from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const router = inject(Router);

  // Clona a requisição e adiciona o cabeçalho de autorização se o token existir
  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  }

  // Se não houver token, passa a requisição original
  return next(req).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        console.error('Token expirado ou inválido. Realizando logout automático.', err);

        // Usa o serviço de autenticação para limpar os dados locais
        authService.logoutLocally();

        // Redireciona o usuário para a tela de login
        router.navigate(['/login']);
      }

      // Propaga o erro para que outros possam lidar com ele se necessário
      return throwError(() => err);
    })
  );
};
