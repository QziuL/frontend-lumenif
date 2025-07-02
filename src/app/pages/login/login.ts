import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth-service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {FloatLabelModule} from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    MessageModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.returnUrl = '';
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.authService.saveToken(response.access_token);
        this.authService.saveUser(response.user);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
      }
    });

    console.log('login feito ',this.authService.getToken(), this.authService.getCurrentUser());
  }
}
