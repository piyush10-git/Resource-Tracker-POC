import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { NavigationService } from '../../Services/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  constructor(private authService: AuthService, private router: Router) { }

  OnLogOutClick(): void {
    this.authService.logout();
    this.router.navigate(['/Login']);
  }
}
