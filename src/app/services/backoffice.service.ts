import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Subscription } from '../models/Subscription.model';
import { User } from '../models/User.model';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class BackofficeService {

  constructor(private http: HttpClient) { }

  getSubscription(): Observable<Subscription> {
    return this.http.get<Subscription>(apiUrl + '/subscription', {headers})
    .pipe(
      map((data: any) => new Subscription().deserialize(data.message)),
      catchError(() => this.handleError)
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get(apiUrl + '/list-users', {headers})
    .pipe(
      map((res: any) => res.message.map((user: User) => new User().deserialize(user))),
      catchError(() => this.handleError)
    );
  }

  addUsers(users: any) {
    return this.http.post(apiUrl + '/add-users', { 'users': users }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  deleteUsers(users: any) {
    return this.http.post(apiUrl + '/delete-users', { 'users': users }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  changeRole(users: any, role: number) {
    return this.http.post(apiUrl + '/modify-role', { 'users': users, 'role': role }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  resendInvitations(users: any) {
    return this.http.post(apiUrl + '/resend-invitations', { 'users': users, }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  private extractData(res: any) {
    let body = res.message;
    return body || {};
  }

  private handleError(error: any): Observable<any> {
    return observableThrowError(error.error)
  }
}
