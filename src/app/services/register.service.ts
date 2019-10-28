import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators'
import * as moment from 'moment';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  constructor(private http: HttpClient) { }

  isUsernameAvailable(username: string) {
    let params = new HttpParams().set('username', username);
    return this.http.get(apiUrl + '/available-username', {headers, params})
    .pipe(this.extractData, catchError(this.handleError));
  }

  subscribeUser(name: string, username: string, invoice: string) {
    return this.http.post(apiUrl + '/subscribe', { 'name': name, 'username': username, 'invoice': invoice }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  activateAccount(username: string, password: string) {
    return this.http.post(apiUrl + '/activate-account', { 'username': username, 'password': password }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  private extractData(res: any) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Observable<any> {
    return observableThrowError(error.error)
  }

}
