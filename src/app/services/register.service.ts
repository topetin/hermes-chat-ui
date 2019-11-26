import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators'
import * as moment from 'moment';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://ec2-18-222-176-250.us-east-2.compute.amazonaws.com"

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  constructor(private http: HttpClient) { }

  isUsernameAvailable(email: string) {
    let params = new HttpParams().set('email', email);
    return this.http.get(apiUrl + '/is-available-user', {headers, params})
    .pipe(this.extractData, catchError(this.handleError));
  }

  subscribeUser(name: string, email: string, invoice: string) {
    return this.http.post(apiUrl + '/subscribe', { 'name': name, 'email': email, 'invoice': invoice }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  activateAccount(email: string, password: string) {
    return this.http.post(apiUrl + '/activate-account', { 'email': email, 'password': password }, { headers: headers })
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
