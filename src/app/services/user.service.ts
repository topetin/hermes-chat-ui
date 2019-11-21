import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators'
import { User } from '../models/User.model';
import { AppStorageService } from './app-storage.service';
import { Feed } from '../models/Feed.model';

const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
const apiUrl = "http://localhost:3000"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
    private storage: AppStorageService) { }


  changeProfileImg(profile_img: number) {
    return new Promise((resolve, reject) => {
      const res = this.http.post<User>(apiUrl + '/change-profile-picture', { 'profile_img': profile_img }, { headers: headers })
      .pipe(catchError(this.handleError))

      if (res) {
        res.subscribe(
          (result) => {
            this.updateStorage(result);
            resolve(true);
          },
          (error) => { reject(error) });
      }
    })
  }

  changePassword(current_password, new_password) {
    return this.http.post(apiUrl + '/change-password', { 'password_current': current_password, 'password_new': new_password }, { headers: headers })
    .pipe(catchError(this.handleError))
  }

  changeName(name: string) {
    return new Promise((resolve, reject) => {
      const res = this.http.post<User>(apiUrl + '/change-name', { 'name_new': name }, { headers: headers })
      .pipe(catchError(this.handleError))

      if (res) {
        res.subscribe(
          (result) => {
            this.updateStorage(result);
            resolve(true);
          },
          (error) => { reject(error) });
      }
    })
  }

  getCompanyFeed(): Observable<any> {
    return this.http.get(apiUrl + '/get-company-feed', {headers})
    .pipe(
      this.extractData,
      catchError(() => this.handleError)
    );
  }

  getCompanyUsers(): Observable<User[]> {
    return this.http.get(apiUrl + '/get-company-users', {headers})
    .pipe(
      map((res: any) => res.message.map((user: User) => new User().deserialize(user))),
      catchError(() => this.handleError)
    );
  }

  private updateStorage(res: any) {
    this.storage.replaceUserOnLocalStorage(res.message as User);
  }

  private extractData(res: any) {
    let body = res;
    return body || {};
  }

  private handleError(error: any): Observable<any> {
    return observableThrowError(error.error)
  }
}
