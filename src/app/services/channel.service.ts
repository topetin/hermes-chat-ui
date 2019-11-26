import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators'
import { throwError as observableThrowError, Observable } from 'rxjs';
import { Channel } from '../models/Channel.model';
import { ChannelMember } from '../models/ChannelMember.model';
import { ChannelMessage } from '../models/ChannelMessage.mode';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://ec2-18-222-176-250.us-east-2.compute.amazonaws.com:3000"

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }

  createChannel(ownerId: number, type: string, title: string, members: number[]) {
    return this.http.post(apiUrl + '/create-channel', { 'ownerId': ownerId, 'type': type, 'title': title, 'members': members }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  getChannels(): Observable<Channel[]> {
    return this.http.get(apiUrl + "/get-channels", { headers })
    .pipe(
      map((res: any) => res.message.map((user: Channel) => new Channel().deserialize(user))),
      catchError(() => this.handleError)
    )
  }

  getChannelInfo(channelId): Observable<ChannelMember[]> {
    let params = new HttpParams().set('channelId', channelId);
    return this.http.get(apiUrl + "/get-channel-info", { params, headers })
    .pipe(
      map((res: any) => res.message.map((cm: ChannelMember) => new ChannelMember().deserialize(cm))),
      catchError(() => this.handleError)
    )
  }

  removeUser(channelId, userId) {
    return this.http.post(apiUrl + '/remove-member', { 'channelId': channelId, 'userId': userId }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  removeChannel(channelId) {
    return this.http.post(apiUrl + '/remove-channel', { 'channelId': channelId }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  addUser(channelId, userId) {
    return this.http.post(apiUrl + '/add-member', { 'channelId': channelId, 'userId': userId }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  removeSingleChannel(channelId, channelOwner, channelMember, channelName) {
    return this.http.post(apiUrl + '/remove-single-channel', 
    { 'channelId': channelId, 'channelOwner': channelOwner, 'channelMember': channelMember, 'channelName': channelName }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  getAppState(companyId): Observable<any[]> {
    let params = new HttpParams().set('companyId', companyId);
    return this.http.get(apiUrl + "/get-app-state", { params, headers })
    .pipe(
      map((res: any) => res.message),
      catchError(() => this.handleError)
    )
  }

  postMessage(companyId, channelId, message, userFromId) {
    return this.http.post(apiUrl + '/post-message', 
    { 'companyId': companyId, 'channelId': channelId, 'message': message, 'userFromId': userFromId }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  listMessages(channelId): Observable<ChannelMessage[]> {
    let params = new HttpParams().set('channelId', channelId);
    return this.http.get(apiUrl + "/get-channel-messages", { params, headers })
    .pipe(
      map((res: any) => res.message),
      catchError(() => this.handleError)
    )
  }

  private handleError(error: any): Observable<any> {
    return observableThrowError(error.error)
  }
}