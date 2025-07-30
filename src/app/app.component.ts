import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResourceTrackerComponent } from './Component/resource-tracker/resource-tracker.component';
import { LoaderCompComponent } from './Component/loader-comp/loader-comp.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderCompComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'POC-FrontEnd';
}
