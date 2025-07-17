import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {Card} from "primeng/card";
import {FloatLabel} from "primeng/floatlabel";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {InputText} from "primeng/inputtext";
import {Message} from "primeng/message";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthService} from '../../services/auth/auth-service';
import {Password} from 'primeng/password';

@Component({
  selector: 'app-register',
  imports: [
    Button,
    Card,
    FloatLabel,
    FormsModule,
    InputText,
    Message,
    ReactiveFormsModule,
    RouterLink,
    Password
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  private returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required, Validators.minLength(6)],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(6), this.validateSamePassword]],
    });

    this.returnUrl = '';
  }

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const password_confirmation = control.parent?.get('password_confirmation');
    return password?.value == password_confirmation?.value ? null : { 'notSame': true };
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.errorMessage = null;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.authService.saveToken(response.access_token);
        this.authService.saveUser(response.user);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
      }
    });
  }
}
