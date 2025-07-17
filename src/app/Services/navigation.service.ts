import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  currentTab: string = 'Home';
  backButtonVisible: boolean = false;

  routerToTabMap: any = {
    Dashboard: 'Dashboard',
    Edit: 'Edit',
    List: 'Resource-Grid',
    Add: 'Add',
  };

  routeMap: any = {
    Dashboard: '/Dashboard',
    List: '/Resource-Grid',
    Add: '/Add',
  };

  titleMap: any = {
    List: 'Resource Grid',
    Dashboard: 'Welcome to the Resource Tracker',
    Add: 'Add New Resource',
    Edit: 'Edit Resource Details',
    BulkEdit: 'Bulk Edit Resources',
  };

  constructor(private router: Router, private location: Location) { }
  
  NavigateToTab(currentTab: string) {
    for (let key in this.routerToTabMap) {
      if (currentTab.includes(this.routerToTabMap[key])) {
        this.currentTab = key.toString();
        break;
      }
    }
    this.router.navigate([this.routeMap[currentTab]]);
  }

  OnBackButtonClick() {
    this.location.back();
  }

  get GetBackButtonVisible(): boolean {
    this.backButtonVisible = window.history.length > 1;
    return this.backButtonVisible;
  }
}
