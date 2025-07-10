import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResourceTrackerComponent } from './Component/resource-tracker/resource-tracker.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ResourceTrackerComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'POC-FrontEnd';
}
