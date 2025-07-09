import { Component } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth-service';

@Component({
  selector: 'app-home',
  imports: [
    ButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  returnUrl: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    console.log('usuario atual',this.authService.getCurrentUser());
    console.log('token atual', this.authService.getToken());
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  adminDashboard() {
    if(!this.authService.isLoggedIn())
    {
      console.log("Usuário não está logado.");
      this.router.navigate(['/login']);
    }
    else
    {
      const user = this.authService.getCurrentUser();

      if(user)
      {
        if(user.roles.some(r => r.name === 'ADMIN'))
          this.router.navigate(['/admin/dashboard']);
        else
        {
          console.log("Usuário não é admin.");
          this.router.navigate(['/home']);
        }
      }
    }
  }

  creatorDashboard() {
    this.router.navigate(['/creator/dashboard']);
    // if(!this.authService.isLoggedIn())
    // {
    //   console.log("Usuário não está logado.");
    //   this.router.navigate(['/login']);
    // }
    // else
    // {
    //   const user = this.authService.getCurrentUser();
    //
    //   if(user)
    //   {
    //     if(user.roles.some(r => r.name === 'CRIADOR'))
    //       this.router.navigate(['/creator/dashboard']);
    //     else
    //     {
    //       console.log("Usuário não é criador.");
    //       this.router.navigate(['/home']);
    //     }
    //   }
    // }
  }
}
