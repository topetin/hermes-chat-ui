import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import decode from 'jwt-decode';
import { AppStorageService } from './app-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router, private storage: AppStorageService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('token');
    const role = this.storage.getStoredUser().role_id + '';
    const roleToCompare = role === '1' ? role : '2';
    // decode the token to get its payload
    if (!token) {
      this.router.navigate(['login']);
      return false;
    }
    // const tokenPayload = decode(token);
    if (
      !this.auth.isAuthenticated() || 
      roleToCompare !== expectedRole
    ) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
