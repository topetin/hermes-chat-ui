import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators'
import * as moment from 'moment';
import decode from 'jwt-decode';
import { AppStorageService } from './app-storage.service';
import { User } from '../models/User.model';

const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
const apiUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private storage: AppStorageService) { }

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

  logout() {
    localStorage.removeItem('token');
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
