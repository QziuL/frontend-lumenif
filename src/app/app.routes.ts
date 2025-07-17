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
import {ManageCourseComponent} from './pages/creator/manage-course/manage-course.component';
import {AuthLayoutComponent} from './components/layouts/auth-layout/auth-layout.component';
import {MainLayoutComponent} from './components/layouts/main-layout/main-layout.component';
import {CourseDetailComponent} from './pages/student/course-detail/course-detail.component';
import {CoursePlayerComponent} from './pages/student/course-player/course-player.component';
import {ManageCoursesComponent} from './pages/admin/manage-courses/manage-courses.component';

export const routes: Routes = [
  // Rotas públicas
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: RegisterComponent },
    ]
  },

  // Rotas protegidas
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard], // A propriedade 'canActivate' diz ao Angular para executar o guard antes de carregar a rota
    children: [
      {
        path: 'home',
        component: HomeComponent ,
      },
      {
        path: 'course/:id',
        component: CourseDetailComponent
      },
      {
        path: 'course-player/:id',
        component: CoursePlayerComponent,
        // canActivate: [alunoGuard]
      },
      {
        path: 'admin/dashboard',
        component: AdminDashboardComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'admin/dashboard/users',
        component: UserList,
        canActivate: [adminGuard]
      },
      {
        path: 'admin/dashboard/manage-courses',
        component: ManageCoursesComponent,
        canActivate: [adminGuard]
      },
      {
        path: 'creator/dashboard',
        component: CreatorDashboardComponent,
        canActivate: [creatorGuard]
      },
      {
        path: 'creator/manage-course/:id',
        component: ManageCourseComponent,
        canActivate: [creatorGuard]
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  {
    path: '',
    redirectTo: '/app/home', // Por padrão, tente ir para a home da área logada
    pathMatch: 'full'
  },

  // Rota de fallback para qualquer caminho não encontrado
  { path: '**', redirectTo: '/app/home' }
];
