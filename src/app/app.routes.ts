import { Routes } from '@angular/router';
import {Login} from './pages/login/login';
import {App} from './app';
import {authGuard} from './guards/auth/auth-guard';
import {UserList} from './pages/admin/user-list/user-list';
import {AdminDashboardComponent} from './pages/admin/dashboard/dashboard.component';
import {CreatorDashboardComponent} from './pages/creator/dashboard/dashboard.component';
import {adminGuard} from './guards/admin/admin-guard';
import {RegisterComponent} from './pages/register/register.component';
import {HomeComponent} from './pages/home/home.component';
import {creatorGuard} from './guards/creator/creator.guard';

export const routes: Routes = [
  // Rotas protegida
  // A propriedade 'canActivate' diz ao Angular para executar o guard antes de carregar a rota
  {
    path: '',
    component: App,
    canActivate: [authGuard]
  },
  {
    path: 'admin/dashboard/users',
    component: UserList,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'creator/dashboard',
    component: CreatorDashboardComponent,
    canActivate: [authGuard, creatorGuard]
  },

  // Rotas públicas
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },


];
