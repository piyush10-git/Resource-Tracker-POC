import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderServiceService } from '../../Services/loader-service.service';

@Component({
  selector: 'app-loader-comp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader-comp.component.html',
  styleUrl: './loader-comp.component.css'
})
export class LoaderCompComponent {
  isLoading: boolean = false;
  constructor(private loaderService: LoaderServiceService) { }

  ngOnInit() {
    this.loaderService.loading$.subscribe((value: boolean) => {
      this.isLoading = value;
    })
  }

}
