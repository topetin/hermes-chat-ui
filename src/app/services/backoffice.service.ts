import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Subscription } from '../models/Subscription.model';

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

  private extractData(res: any) {
    let body = res.message;
    return body || {};
  }

  private handleError(error: any): Observable<any> {
    return observableThrowError(error.error)
  }
}
