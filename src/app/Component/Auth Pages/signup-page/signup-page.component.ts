import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, SignupDto } from '../../../Services/auth.service';
import { ApiResoponse } from '../../../Interfaces/Interfaces';
import { ToastrService } from 'ngx-toastr';
import { LookupServiceService } from '../../../Services/lookup-service.service';
import { HttpAPIClientService } from '../../../Services/http-api-client.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup-page.component.html',
  styleUrl: './signup-page.component.css'
})
export class SignupPageComponent implements OnInit {
  authForm: FormGroup = new FormGroup({
    username: new FormControl<string | null>('', [Validators.required, this.whiteSpaceValidator]),
    email: new FormControl<string | null>('', [Validators.required, Validators.email]),
    password: new FormControl<string | null>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string | null>(''),
    role: new FormControl<number | null>(null, [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password == confirmPassword ? null : { mismatch: true };
  }

  whiteSpaceValidator(control: AbstractControl): ValidationErrors | null {
    const whiteSpaces = (control?.value || '').indexOf(' ') >= 0;
    return whiteSpaces ? { whitespaces: true } : null;
  }

  constructor(private router: Router, private authService: AuthService, private toastr: ToastrService, private http: HttpAPIClientService) { }

  private roleOptionsSubject = new BehaviorSubject<any[]>([]);
  roleOptions$ = this.roleOptionsSubject.asObservable();

  getRoleOptions() {
    this.http.GetRoleOptions().subscribe({
      next: (response: ApiResoponse) => {
        if (response.success) {
          this.roleOptionsSubject.next(response.data as any[]);
        } else {
          console.log("Error", response);
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.getRoleOptions();
  }

  onSubmit() {
    if (this.authForm.invalid) return;

    const { username, email, password, confirmPassword, role } = this.authForm.value;

    if (password !== confirmPassword) {
      this.authForm.get('confirmPassword')?.setErrors({ mismatch: true });
      return;
    }

    console.log('Signing up with', email, password);

    const credentials: SignupDto = {
      username: username,
      email: email.toLowerCase(),
      password: password,
      roleId: role,
    };
    console.log(credentials);
    this.authService.createUser(credentials).subscribe({
      next: (response: ApiResoponse) => {
        console.log(response);
        if (response.success) {
          this.toastr.info('Successfuly created new user', 'Signup');
          this.router.navigate(['/Login']);
        } else {
          this.toastr.error('Error occured while creating new user', 'Siggup');
        }
      },
      error: (err: any) => {
        console.error(err);
        this.toastr.error('Error occured while creating new user', 'Signup');
      }
    });

  }

  ChangeTab() {
    this.router.navigate(['/Login']);
  }

  get email() {
    return this.authForm.get('email');
  }

  get password() {
    return this.authForm.get('password');
  }

  get confirmPassword() {
    return this.authForm.get('confirmPassword');
  }

  get username() {
    return this.authForm.get('username');
  }

  get role() {
    return this.authForm.get('role');
  }
}
