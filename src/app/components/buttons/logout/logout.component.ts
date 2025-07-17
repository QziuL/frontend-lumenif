import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {AuthService} from '../../../services/auth/auth-service';
import {UserInterface} from '../../../interfaces/user-interface';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [
    Button
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
