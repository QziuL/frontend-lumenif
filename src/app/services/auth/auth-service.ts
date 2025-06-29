import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthResponseInterface} from '../../interfaces/auth-response-interface';
import {UserInterface} from '../../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string = environment.apiUrl;
  private readonly USER_KEY = 'auth_user';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<AuthResponseInterface> {
    return this.http.post<AuthResponseInterface>(`${this.apiUrl}/register`, userData);
  }

  login(userData: any): Observable<AuthResponseInterface> {
    return this.http.post<AuthResponseInterface>(`${this.apiUrl}/login`, userData).pipe(
      tap(res => {
        this.saveToken(res.access_token);
        this.saveUser(res.user);
      }),
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Limpa tudo ao fazer logout
        this.removeToken();
        this.removeUser();
      })
    );
  }

  saveUser(user: UserInterface): void {
    // Objetos precisam ser convertidos para string JSON para serem guardados no localStorage
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string|null{
    return localStorage.getItem('auth_token');
  }

  getCurrentUser(): UserInterface | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) {
      return null;
    }
    // Converte a string JSON de volta para um objeto
    return JSON.parse(userJson) as UserInterface;
  }

  removeToken() {
    localStorage.removeItem('auth_token');
  }

  private removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(){
    return !!this.getToken();
  }
}
