import { Inject,Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { User } from '../models/User.model';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public storeUserOnLocalStorage(user: User): void {
    this.storage.set('user-data', user);
  }

  public storeUserCompanyOnLocalStorage(companyData: any): void {
    this.storage.set('user-company-data', {id: companyData.id, profileImg: companyData.profile_img, name: companyData.name});
  }

  public storeAppState(state: any): void {
    this.storage.set('app-state', {state : state, unreadChannels: []});
  }

  public getStoredUser() {
    return this.storage.get('user-data')
  }

  public getAppState() {
    return this.storage.get('app-state')
  }

  public getStoredUserCompany() {
    return this.storage.get('user-company-data')
  }

  public addToAppState(state) {
    let currentState = Object.assign({}, this.storage.get('app-state'));
    currentState.state.push(state)
    this.storage.remove('app-state');
    this.storage.set('app-state', currentState);
  }

  public addUnreadChannelToAppState(channel) {
    let currentState = Object.assign({}, this.storage.get('app-state'));
    currentState.unreadChannels.push(channel)
    this.storage.remove('app-state');
    this.storage.set('app-state', currentState);
  }

  public removeUnreadChannelFromAppState(channel) {
    let currentState = Object.assign({}, this.storage.get('app-state'));
    let index = currentState.unreadChannels.findIndex(s => s.id === channel.id );
    if (index > -1) {
      currentState.unreadChannels.splice(index, 1);
  }
    this.storage.remove('app-state');
    this.storage.set('app-state', currentState);
  }

  public removeFromAppState(state) {
    let currentState = Object.assign({}, this.storage.get('app-state'));
    let index = currentState.state.findIndex(s => s.socketId === state.socketId );
    if (index > -1) {
      currentState.state.splice(index, 1);
  }
    this.storage.remove('app-state');
    this.storage.set('app-state', currentState);
  }

  public replaceUserOnLocalStorage(user: User): void {
    this.storage.remove('user-data');
    this.storage.set('user-data', user);
  }

  public removeUserOnLocalStorage() {
    this.storage.remove('user-data');
  }
}
