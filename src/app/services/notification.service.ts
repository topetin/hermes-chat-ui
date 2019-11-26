import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators'
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Channel } from '../models/Channel.model';
import { ChannelMember } from '../models/ChannelMember.model';
import { ChannelMessage } from '../models/ChannelMessage.mode';
import { Notification } from '../models/Notification.model';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://ec2-18-222-176-250.us-east-2.compute.amazonaws.com"

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  postNotification(companyId, channelId, message, userId) {
    return this.http.post(apiUrl + '/post-notification', 
    { 'companyId': companyId, 'channelId': channelId, 'message': message, 'userId': userId }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get(apiUrl + "/get-notifications", { headers })
    .pipe(
      map((res: any) => res.message.map((notification: Notification) => new Notification().deserialize(notification))),
      catchError(() => this.handleError)
    )
  }

  updateNotifications() {
    return this.http.post(apiUrl + '/update-notifications',{ headers: headers })
    .pipe(catchError(this.handleError))
  }

  private handleError(error: any): Observable<any> {
    return observableThrowError(error.error)
  }
}