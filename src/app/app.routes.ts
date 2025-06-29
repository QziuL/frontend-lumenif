import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {App} from './app';
import {authGuard} from './auth/auth/auth-guard';
import {UserList} from './pages/admin/user-list/user-list';
import {DashboardComponent} from './pages/admin/dashboard/dashboard.component';
import {adminGuard} from './auth/admin/admin-guard';

export const routes: Routes = [
  // Rotas públicas
  { path: '', component: App },
  { path: 'login', component: Login },
  // { path: 'register', component: RegisterComponent },

  // Rota protegida
  // A propriedade 'canActivate' diz ao Angular para executar o guard antes de carregar a rota
  {
    path: 'admin/dashboard/users',
    component: UserList,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, adminGuard]
  },
];
