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

  public getStoredUser() {
    return this.storage.get('user-data')
  }


  public getStoredUserCompany() {
    return this.storage.get('user-company-data')
  }

  public replaceUserOnLocalStorage(user: User): void {
    this.storage.remove('user-data');
    this.storage.set('user-data', user);
  }

  public removeUserOnLocalStorage() {
    this.storage.remove('user-data');
  }
}
