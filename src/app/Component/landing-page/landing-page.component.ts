import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpAPIClientService } from '../../Services/http-api-client.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  routeMap: any = {
    Dashboard: '/Dashboard',
    List: '/Resource-Grid',
    Add: '/Add',
  }
  constructor(private router: Router, private httpAPIClient: HttpAPIClientService) { }

  ResourceStatistics: any = {
    resourceCount: null,
    billableResourcesCount: null,
    NonbillableResourcesCount: null,
    totalProject: null,
  }

  loading: boolean = true;

  ngOnInit() {
    this.httpAPIClient.GetResourceStatistics().subscribe((response: any) => {
      this.loading = true;
      console.log(response);
      if (response?.success) {
        this.ResourceStatistics.resourceCount = parseInt(response.data[0]);
        this.ResourceStatistics.billableResourcesCount = parseInt(response.data[1]);
        this.ResourceStatistics.NonbillableResourcesCount =  parseInt(response.data[0]) - parseInt(response.data[1]);
        this.ResourceStatistics.totalProject = parseInt(response.data[2]);

        this.loading = false;
      }
    })
  }

  NavigateToTab(currentTab: string) {
    this.router.navigate([this.routeMap[currentTab]]);
  }
}
