import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../Services/auth.service";

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const expectedRoles = route.data['role'] as string[];
    
    if(!authService.hasRole(expectedRoles)) {
        // router.navigate(['/unautherized']);
        return false;
    }

    return true;
}