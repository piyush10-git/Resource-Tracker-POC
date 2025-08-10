import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavigationService } from '../../Services/navigation.service';
import { LookupServiceService } from '../../Services/lookup-service.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-resource-tracker',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './resource-tracker.component.html',
  styleUrl: './resource-tracker.component.css'
})
export class ResourceTrackerComponent {
  currentTab: string = 'Home';

  routerToTabMap: any = {
    Dashboard: 'Dashboard',
    Edit: 'Edit',
    List: 'Resource-Grid',
    Add: 'Add',
    Admin: 'Admin',
    Profile: 'Profile',
  };

  routeMap: any = {
    Dashboard: '/Dashboard',
    List: '/Resource-Grid',
    Add: '/Add',
    Admin: '/Admin',
  }

  titleMap: any = {
    List: 'Resource Grid',
    Dashboard: 'Welcome to the Resource Tracker',
    Add: 'Add New Resource',
    Edit: 'Edit Resource Details',
    Profile: 'Profile Page',
    Admin: 'Admin Dashboard',
  }

  contentMap: any = {
    List: 'Browse and manage all employee resources in one place. Use the filters to search by technology, project, or location. Click on a row to view or edit details',
    Dashboard: 'Track, manage, and analyze internal resources at a glance',
    Add: 'Enter the resource’s details including designation, technology skills, and project allocation.',
    Edit: 'Update the resource’s information including role, project, skills, and other relevant details. Use this section to maintain accurate and up-to-date records.',
    Profile: 'User details',
    Admin: 'Admin Dashboard',
  }

  constructor(private router: Router, private navigationService: NavigationService, private lookupService: LookupServiceService, private authService: AuthService) { }

  ngOnInit() {
    this.lookupService.GetDropdownOptions();
  }

  NavigateToTab(currentTab: string) {
    this.navigationService.NavigateToTab(currentTab);
  }

  OnBackButtonClick() {
    this.navigationService.OnBackButtonClick();
  }

  GetBackButtonStatus(): boolean {
    return this.navigationService.GetBackButtonVisible;
  }

  getStyles(tabNames: Array<string>) {
    for (let key in this.routerToTabMap) {
      if (this.router.url.toString().includes(this.routerToTabMap[key])) {
        this.currentTab = key.toString();
        break;
      }
    }

    let style = 'material-symbols-outlined';
    let isThisCurrentTab = false;
    for (let tabName of tabNames) {
      if (this.currentTab == tabName) {
        isThisCurrentTab = true;
        break;
      }
    }
    if (!isThisCurrentTab) {
      style += ' not-selected';
    }
    return style;
  }

  GetTitleText(): string {
    const currentTab = this.currentTab;
    return this.titleMap[currentTab];
  }

  GetConetntText(): string {
    const currentTab = this.currentTab;
    return this.contentMap[currentTab];
  }

  GetButtonIcon() {
    return this.router.url.toString().includes('Edit') ? 'edit' : 'add_box';
  }

  OnLogOutClick(): void {
    this.authService.logout();
    this.navigationService.NavigateToTab('Login');
  }


  // getData() {
  //   // this.apiservice.TestAPI().subscribe((data) => {
  //   //   console.log(data);
  //   // })
  // }

  // ngOnInit() {
  //   const gridData = localStorage.getItem("EmployeeGrid");
  //   if (gridData) {
  //     this.employeeDetailsArray = JSON.parse(gridData);
  //   }
  //   this.getData();
  // }

  // handleNewEmployeeDetailsEmitter(newEmployeeDetails: EmployeeDetails) {
  //   // this.employeeDetailsArray.push(newEmployeeDetails);
  //   this.employeeDetailsArray = [newEmployeeDetails, ...this.employeeDetailsArray ];
  //   localStorage.setItem("EmployeeGrid", JSON.stringify(this.employeeDetailsArray))
  // }
}
