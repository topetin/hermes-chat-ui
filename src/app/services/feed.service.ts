import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { Feed } from '../models/Feed.model';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  constructor(private http: HttpClient) { }

  postFeed(message: any) {
    return this.http.post(apiUrl + '/post-feed', { 'message': message }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  getFeed(): Observable<Feed[]> {
    return this.http.get(apiUrl + '/get-feed', {headers})
    .pipe(
      map((res: any) => res.message.map((user: Feed) => new Feed().deserialize(user))),
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
