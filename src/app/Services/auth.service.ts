import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../Environment/Environment';
import { tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { ApiResoponse } from '../Interfaces/Interfaces';

export interface LoginDto {
  usernameOrEmail: string,
  password: string,
}

export interface SignupDto {
  username: string,
  email: string,
  password: string,
  roleId: number,
}

interface DecodedToken {
  exp: number,
  role: string[] | string,
  sub?: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey : string = 'auth_token';
  private readonly url: string = Environment.URI + '/api/auth';
  constructor(private http: HttpClient) { }

  createUser(credentials: SignupDto) {
    const endpoint = this.url + '/sign-up';
    return this.http.post<ApiResoponse>(endpoint, credentials);
  }

  login(credentials: LoginDto) {
    const endpoint = this.url + '/login';
    return this.http.post<ApiResoponse>(endpoint, credentials).pipe(
      tap((response: ApiResoponse)=> {
        if(response?.data?.token) {
          localStorage.setItem(this.tokenKey, response?.data?.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const decoded = this.decodeToken();
    if(!decoded) return false;
    return decoded?.exp * 1000 > Date.now();
  }

  decodeToken(): DecodedToken | null {
    const token = this.getToken();
    if(!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    }
    catch {
      return null;
    }
  }

  getUserRolls(): string[] {
    const decoded = this.decodeToken();
    const roles = decoded?.role;
    if(!roles) return [];
    return Array.isArray(roles) ? roles : [roles];
  }

  hasRole(requiredRoles: string[]) : boolean {
    const userRoles = this.getUserRolls();    
    return requiredRoles.some(roles => userRoles.includes(roles));
  }
 
}
