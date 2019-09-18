import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators'

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})

export class HomeService {

  constructor(private http: HttpClient) { }

  getHelloWorld() {
    return this.http.get(apiUrl, {headers}).pipe(this.extractData, catchError(this.handleError))
  }

  private extractData(res: any) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Observable<any> {
      return observableThrowError(JSON.stringify(error.error.error))
  }
}
