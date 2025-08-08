import { Routes } from '@angular/router';
import { EmployeeInputFormComponent } from './Component/employee-input-form/employee-input-form.component';
import { NewGridComponent } from './Component/new-grid/new-grid.component';
import { LandingPageComponent } from './Component/landing-page/landing-page.component';
import { authGaurd } from './Guards/auth.guard';
import { ResourceTrackerComponent } from './Component/resource-tracker/resource-tracker.component';
import { LoginPageComponent } from './Component/Auth Pages/login-page/login-page.component';
import { SignupPageComponent } from './Component/Auth Pages/signup-page/signup-page.component';
import { UnauthorizedPageComponent } from './Component/unauthorized-page/unauthorized-page.component';
import { roleGuard } from './Guards/role.guard';
import { ProfilePageComponent } from './Component/profile-page/profile-page.component';

export const routes: Routes = [
    { path: 'Unauthorized', component: UnauthorizedPageComponent },
    { path: 'Login', component: LoginPageComponent },
    { path: 'Signup', component: SignupPageComponent },
    { path: '', redirectTo: '/Login', pathMatch: 'full' },
    {
        path: '', component: ResourceTrackerComponent,
        children: [
            {
                path: 'Dashboard', component: LandingPageComponent,
                canActivate: [authGaurd, roleGuard],
                data: { roles: ['Admin'] }
            },
            {
                path: 'Resource-Grid', component: NewGridComponent,
                canActivate: [authGaurd, roleGuard],
                data: { roles: ['Admin', 'Manager', 'Employee'] }
            },
            {
                path: 'Add', component: EmployeeInputFormComponent,
                canActivate: [authGaurd, roleGuard],
                data: { roles: ['Admin', 'Manager'] }
            },
            {
                path: 'Edit/:empId', component: EmployeeInputFormComponent,
                canActivate: [authGaurd, roleGuard],
                data: { roles: ['Admin', 'Manager'] }
            },
             {
                path: 'Profile', component: ProfilePageComponent,
                canActivate: [authGaurd],
             }
        ],
        canActivate: [authGaurd]
    },
    { path: '**', redirectTo: '/Login', pathMatch: 'full' },
];