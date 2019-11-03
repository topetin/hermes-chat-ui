import { Component, OnInit, ViewChild } from '@angular/core';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'src/app/models/Subscription.model';
import { BackofficeService } from 'src/app/services/backoffice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-backoffice-main',
  templateUrl: './backoffice-main.component.html',
  styleUrls: ['./backoffice-main.component.css']
})
export class BackofficeMainComponent implements OnInit {

  userData: any;
  subscriptionData: Subscription;
  
  @ViewChild('tabs', {static: false}) tabs: MatTabGroup;

  constructor(
    private storage: AppStorageService,
    private backofficeService: BackofficeService,
    private _snackBar: MatSnackBar,
    private authService: AuthService) { }

  ngOnInit() {
    this.userData = this.storage.getStoredUser();
    this.getSubscriptionData();
  }

  changeContent($event) {
    this.tabs.selectedIndex = $event;
  }

  updateProfileImage($event) {
    if ($event === 'refresh') {
      window.location.reload();
    }
  }

  private getSubscriptionData() {
    this.backofficeService.getSubscription().subscribe(
      data => { this.subscriptionData =  data; },
      error => { this.displayError(error); }
    )
  }

  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  logout() {
    this.authService.logout(this.userData.email)
  }

}
