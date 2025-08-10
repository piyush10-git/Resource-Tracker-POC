import { Component } from '@angular/core';
import { KENDO_GRID } from "@progress/kendo-angular-grid";
import { KENDO_TOOLBAR } from "@progress/kendo-angular-toolbar";
import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { CommonModule } from '@angular/common';
import { ApiResoponse } from '../../../Interfaces/Interfaces';
import { BehaviorSubject } from 'rxjs';
import { HttpAPIClientService } from '../../../Services/http-api-client.service';
import { FormsModule } from '@angular/forms';

export interface User {
  empId: number;
  name: string;
  email: string;
  username: string;
  roleId: number;
  status: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, KENDO_GRID, KENDO_TOOLBAR, KENDO_LABELS, KENDO_INPUTS],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {
  users: User[] = [
    { empId: 3331, name: 'John Doe', email: 'John@Doe', username: 'johndoe', roleId: 1, status: true },
    { empId: 3332, name: 'Jane Smith', email: 'Jane@Smith', username: 'janesmith', roleId: 2, status: false },
    { empId: 3333, name: 'Alice Johnson', email: 'Alice@Johnson', username: 'alicej', roleId: 1, status: true },
    { empId: 3334, name: 'Bob Brown', email: 'Bob@Brown', username: 'bobbrown', roleId: 3, status: false }
  ]

  constructor(private http: HttpAPIClientService) { }

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
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.getRoleOptions();
  }

  editUser(dataItem: User): void {
    // Logic to edit user
    console.log('Edit user functionality to be implemented');
  }
  deleteUser(dataItem: User): void {
    // Logic to delete user
    console.log('Delete user functionality to be implemented');
  }
}
