import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { FeedService } from 'src/app/services/feed.service';
import { AuthService } from 'src/app/services/auth.service';
import { Feed } from 'src/app/models/Feed.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserAccountComponent } from '../user-account/user-account.component';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {

  userData: User;
  feedData: Feed[];
  showAccount = false;

  constructor(private storage: AppStorageService,
    private feedService: FeedService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.userData = this.storage.getStoredUser();
    this.getFeed();
  }

  logout() {
    this.authService.logout(this.userData.email)
  }
  
  private getFeed() {
    this.feedService.getFeed()
    .subscribe(
      data => this.feedData = data,
      error => this.displayError(error)
    )
  }

  refetchUserData() {
    this.userData = this.storage.getStoredUser();
  }

  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  openAccount() {
    this.showAccount = true;
  }

}
