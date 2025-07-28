import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-page',
  standalone: true,
  imports: [],
  templateUrl: './unauthorized-page.component.html',
  styleUrl: './unauthorized-page.component.css'
})
export class UnauthorizedPageComponent implements OnInit, OnDestroy{
  countdown = 10;
  private timer: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
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
}
