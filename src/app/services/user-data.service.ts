import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  data: any;

  constructor() { }

  getUserData() {
    return this.data;
  }

  setUserData(data) {
    this.data = data;
  }
}
