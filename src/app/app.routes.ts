import { Routes } from '@angular/router';
import { EmployeeInputFormComponent } from './Component/employee-input-form/employee-input-form.component';
import { NewGridComponent } from './Component/new-grid/new-grid.component';
import { LandingPageComponent } from './Component/landing-page/landing-page.component';

export const routes: Routes = [
    {path:'Dashboard', component: LandingPageComponent},
    {path:'Resource-Grid', component: NewGridComponent},
    {path:'Add', component: EmployeeInputFormComponent},
    {path:'Edit/:empId', component: EmployeeInputFormComponent},
    {path:'', redirectTo:'/Dashboard', pathMatch:'full'},
    {path:'**', redirectTo:'/Dashboard', pathMatch:'full'},
];
