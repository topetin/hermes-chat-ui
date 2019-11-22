import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators'
import { throwError as observableThrowError, Observable } from 'rxjs';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }

  createChannel(ownerId: number, type: string, title: string, members: number[]) {
    return this.http.post(apiUrl + '/create-channel', { 'ownerId': ownerId, 'type': type, 'title': title, 'members': members }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  private handleError(error: any): Observable<any> {
    return observableThrowError(error.error)
  }
}