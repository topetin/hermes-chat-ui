import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators'
import * as moment from 'moment';
import decode from 'jwt-decode';
import { AppStorageService } from './app-storage.service';
import { User } from '../models/User.model';
import { Router } from '@angular/router';

const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
const apiUrl = "http://ec2-18-222-176-250.us-east-2.compute.amazonaws.com:3000"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private storage: AppStorageService,
    private router: Router) { }

  loginUser(email, password) {
    return new Promise((resolve, reject) => {
      const res = this.http.post<User>(apiUrl + '/login', { 'email': email, 'password': password }, { headers: headers })
        .pipe(catchError(this.handleError))

      if (res) {
        res.subscribe(
          (result) => {
            if (!result.token) {
              reject(false);
            }
            this.setSession(result);
            resolve(true);
          },
          (error) => { reject(error) });
      }
    })
  }

  private setSession(res: any) {
    localStorage.setItem('token', res.token);
    // const role = decode(res.token).role;
    this.storage.storeUserOnLocalStorage(res.user as User);
  }

  private handleError(error: any): Observable<any> {
    return observableThrowError(error.error)
  }

  logout(email?) {
    localStorage.removeItem('token');
    this.storage.removeUserOnLocalStorage();
    email ? this.router.navigate(['login'], {state: {email: email}}) : this.router.navigate(['login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    return !this.jwtHelper.isTokenExpired(token);
  }

  getExpiration() {
    const token = localStorage.getItem('token');
    return moment(this.jwtHelper.getTokenExpirationDate(token));
  }
}
