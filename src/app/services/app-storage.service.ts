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
    this.storage.set('app-state', {ids: state});
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

  public addToAppState(id) {
    let currentState = Object.assign({}, this.storage.get('app-state'));
    currentState.ids.push(id)
    this.storage.remove('app-state');
    this.storage.set('app-state', currentState);
  }

  public removeFromAppState(id) {
    let currentState = Object.assign({}, this.storage.get('app-state'));
    console.log(currentState)
    let newState = currentState.ids.map((i) => i !== id)
    console.log(newState)
    this.storage.remove('app-state');
    this.storage.set('app-state', newState);
  }

  public replaceUserOnLocalStorage(user: User): void {
    this.storage.remove('user-data');
    this.storage.set('user-data', user);
  }

  public removeUserOnLocalStorage() {
    this.storage.remove('user-data');
  }
}
