import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginDto } from '../../../Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ApiResoponse } from '../../../Interfaces/Interfaces';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  authForm: FormGroup = new FormGroup({
    usernameOrEmail: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { usernameOrEmail, password } = this.authForm.value;

    // Simulate auth request
    console.log('Logging in with', usernameOrEmail, password);

    const credentials: LoginDto = {
      usernameOrEmail: usernameOrEmail,
      password: password,
    };
    console.log(credentials);
    this.authService.login(credentials).subscribe({
      next: (response: ApiResoponse) => {
        console.log(response);
        if (response.success) {
          this.toastr.info('Successfuly signed in', 'Login');
          this.router.navigate(['/Resource-Grid']);
        } else {
          this.toastr.error('Error occured while login', 'Login');
        }
      },
      error: (err: any) => {
        if (err.status == 401) {
          this.toastr.error('Invalid username or password', 'Login');
        } else {
          this.toastr.error('Error occured while login', 'Login');
        }
      }
    });
  }

  ChangeTab() {
    this.router.navigate(['/Signup']);
  }

  get usernameOrEmail() {
    return this.authForm.get('usernameOrEmail');
  }

  get password() {
    return this.authForm.get('password');
  }
}
