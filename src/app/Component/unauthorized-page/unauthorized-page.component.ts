import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../Services/navigation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unauthorized-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unauthorized-page.component.html',
  styleUrl: './unauthorized-page.component.css'
})
export class UnauthorizedPageComponent implements OnInit, OnDestroy {
  countdown: number = 10;
  backButtonVisible: boolean = false;
  private timer: any;

  constructor(private router: Router, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.backButtonVisible = this.navigationService.GetBackButtonVisible;

    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.router.navigate(['/Login']);
      }
    }, 1000);
  }

  redirectToLogin(): void {
    this.router.navigate(['/Login']);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  OnBackButtonClick() {
    this.navigationService.OnBackButtonClick();
  }

}
