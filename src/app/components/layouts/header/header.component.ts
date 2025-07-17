import { Component } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../../services/auth/auth-service';
import {Router, RouterLink} from '@angular/router';
import {UserInterface} from '../../../interfaces/user-interface';
import {Button} from 'primeng/button';
import {Menu} from 'primeng/menu';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    Button,
    Menu
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn = false;
  user: UserInterface | null = null;
  userMenuItems: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.user = this.authService.getCurrentUser();

    if (this.isLoggedIn && this.user) {
      this.setupUserMenu();
    }
  }

  setupUserMenu(): void {
    this.userMenuItems = [
      {
        label: 'Meu Painel',
        icon: 'pi pi-th-large',
        command: () => {
          // Redireciona para o painel correto baseado no papel
          const role = this.user?.roles[0]?.name;
          if (role === 'ADMIN') this.router.navigate(['/app/admin/dashboard']);
          else if (role === 'CREATOR') this.router.navigate(['/app/creator/dashboard']);
          //else this.router.navigate(['/aluno/dashboard']); // painel de aluno
        }
      },
      {
        label: 'Meu Perfil',
        icon: 'pi pi-user-edit',
        command: () => this.router.navigate(['/app/profile'])
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
      // Recarregar a página para limpar
      window.location.reload();
    });
  }

  // BUTTON DARK MODE
  toggleDarkMode() {
    const element = document.querySelector('html');
    if(element) {
      element.classList.toggle('my-app-dark');
    }
  }
}
