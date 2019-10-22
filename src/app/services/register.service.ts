import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'
import * as moment from 'moment';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  constructor(private http: HttpClient) { }

  loginUser(username, password) {
    const res =  this.http.post<any>(apiUrl + '/login', {'username': username, 'password': password}, {headers: headers})
    .pipe(catchError(this.handleError))

    if (res) {
      res.subscribe(
        (result) => {
          this.setSession(result);
          return null;
        },
        (error) => { return error });
    }
  }

  private extractData(res: any) {
    let body = res;
    return body || {};
  }

  private setSession(res: any) {
    const expiresAt = moment().add(res.expiresIn,'second');

    localStorage.setItem('id_token', res.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  private handleError(error: any): Observable<any> {
      return observableThrowError(error.error)
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
}

  isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }  
}
