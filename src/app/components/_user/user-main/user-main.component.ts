import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User.model';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { FeedService } from 'src/app/services/feed.service';
import { AuthService } from 'src/app/services/auth.service';
import { Feed } from 'src/app/models/Feed.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UserAccountComponent } from '../user-account/user-account.component';
import { UserService } from 'src/app/services/user.service';
import { ChannelService } from 'src/app/services/channel.service';
import { Channel } from 'src/app/models/Channel.model';

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {

  userData: User;
  feedData: Feed[];
  userChannels: Channel[];
  companyData: any;
  showAccount: boolean;
  mainview = true;
  onChannel: Channel;

  constructor(private storage: AppStorageService,
    private userService: UserService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private channelService: ChannelService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.showAccount = false;
    this.userData = this.storage.getStoredUser();
    this.getFeed();
    this.getChannels();
    setInterval(()=> {
      this.getFeed();
    }, 40000)
  }

  logout() {
    this.authService.logout(this.userData.email)
  }
  
  private getFeed() {
    this.userService.getCompanyFeed()
    .subscribe(
      data => {
        this.feedData = data.message.feeds.map((user: Feed) => new Feed().deserialize(user));
        this.storage.storeUserCompanyOnLocalStorage(data.message.company)
        this.companyData = this.storage.getStoredUserCompany();
      },
      error => this.displayError(error)
    )
  }

  private getChannels() {
    this.channelService.getChannels()
    .subscribe(
      data => this.userChannels = data,
      error => this.displayError(error)
    )
  }
  
  refetchChannels($event) {
    this.getChannels();
    this.goChannel($event);
  }

  goChannel($event) {
    console.log($event)
    this.onChannel = $event;
    this.mainview = false;
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

  goFeed() {
    this.getFeed();
    this.mainview = true;
  }

}
