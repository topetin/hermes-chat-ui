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
import { ChannelMember } from 'src/app/models/ChannelMember.model';
import { ChatService } from 'src/app/services/chat.service';
import { ChannelMessage } from 'src/app/models/ChannelMessage.mode';
import * as moment from 'moment';

export interface ChannelInfo {
  id: number,
  members: ChannelMember[]
}

@Component({
  selector: 'app-user-main',
  templateUrl: './user-main.component.html',
  styleUrls: ['./user-main.component.css']
})
export class UserMainComponent implements OnInit {

  userData: User;
  feedData: Feed[];
  userChannels: Channel[];
  allChannelsInfo = new Array<ChannelInfo>();
  companyData: any;
  showAccount: boolean;
  mainview = true;
  onChannelInfo = false;
  onChannel: Channel;
  channelInfo: ChannelInfo;
  appState: any;
  unreadChannels = new Array<Channel>();
  channelMessages = new Array<ChannelMessage>();
  currentChannelMessages: ChannelMessage[];

  constructor(private storage: AppStorageService,
    private userService: UserService,
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private channelService: ChannelService,
    public dialog: MatDialog,
    private chatService: ChatService) { }

  ngOnInit() {
    this.showAccount = false;
    this.userData = this.storage.getStoredUser();
    this.getAppState();
    this.initIoConnection();
    this.getFeed();
    setInterval(()=> {
      this.getFeed();
    }, 40000)
  }

  getAppState() {
    this.channelService.getAppState(this.userData.company_id)
    .subscribe(
      data => {
        this.storage.storeAppState(data),
        this.appState = this.storage.getAppState()
      },
      error => this.displayError(error)
    )
  }

  private initIoConnection(): void {
    this.chatService.initSocket();

    this.chatService.emitOnline(this.userData.company_id, this.userData.id);

    this.chatService.onOnline().subscribe((data: any) => {
      this.storage.addToAppState(data)
      this.appState = this.storage.getAppState()

      this.getChannels()
    })

    this.chatService.onOffline().subscribe((data: any) => {
      this.storage.removeFromAppState(data.user)
      this.appState = this.storage.getAppState()
    })

    this.chatService.onJoin().subscribe((data: any) => {
    })

    this.chatService.onMessageFromNewChannel().subscribe((data: any) => {
      this.getChannels()
      this.storage.addUnreadChannelToAppState(data)
      this.appState = this.storage.getAppState()
    })

    this.chatService.onMessage().subscribe((data: any) => {
      if (data.senderId !== this.userData.id) {
        this.storage.addUnreadChannelToAppState(data.channel);
        this.appState = this.storage.getAppState()
      }
      this.addToChannelMessages(data.message)
      if (this.onChannel && data.message.channel_id === this.onChannel.id) {
        this.currentChannelMessages.push(data.message);
      }
    })
  }

  formatUserChannels() {
    return this.userChannels.map((chan) => chan.id)
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
    return this.channelService.getChannels()
    .subscribe(
      data => {
        this.userChannels = data
        this.chatService.emitJoin(this.formatUserChannels())
      },
      error => this.displayError(error)
    )
  }
  
  refetchChannels($event) {
    this.getChannels().add(() => this.goChannel($event));
  }

  updateChannel($event) {
    this.removeChannelFromList($event);
    this.getChannels();
    this.getChannelInfo($event);
  }

  goChannel($event) {
    this.getChannelInfo($event);
    this.getChannelMessages($event);
    this.onChannel = $event;
    this.mainview = false;
  }

  getChannelMessages(channel) {
    this.channelService.listMessages(channel.id).subscribe(
      data => {
        this.currentChannelMessages = data
      },
      error => this.displayError(error)
    )
  }

  refetchUserData() {
    this.userData = this.storage.getStoredUser();
  }

  getChannelInfo(channel: Channel) {
    let found = this.findChannelInfo(channel);
    if (found) {
      this.channelInfo = found;
      return ;
    }
    this.channelService.getChannelInfo(channel.id)
    .subscribe(
      data => { 
        this.channelInfo = {id: channel.id, members: data };
        this.allChannelsInfo.push(this.channelInfo);
       }
    )
  }

  removeChannelFromList(channel: Channel) {
    let found = this.allChannelsInfo.findIndex(element => element.id === channel.id)
    this.allChannelsInfo.splice(found, 1)
  }

  findChannelInfo(channel: Channel) {
    let found = undefined;
    this.allChannelsInfo.map((cn) => {
      if (cn.id === channel.id) {
        found = cn;
      }
    })
    return found;
  }

  updateChannelsAndGoToFeeds() {
    this.getChannels();
    this.goFeed();
  }

  processChannelInfo() {
    this.onChannelInfo = !this.onChannelInfo;
    this.showAccount = false;
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

  goOrCreateChannel($event) {
    let found = this.findChannel($event);
    found ? this.goChannel(found) : this.createChannel($event)
  }

  private findChannel($event) {
    let found = undefined;
    this.userChannels.map((value) => {
      if ($event.hasOwnProperty('title') && value.title === $event.title) {
        found = value;
      }
      if ($event.hasOwnProperty('name')) {
        let readTitle = value.title.split('//')
        if (readTitle.length === 2 && 
            ((readTitle[0] === $event.username  && readTitle[1] === this.userData.username)
            || (readTitle[1] === $event.username && readTitle[0] === this.userData.username))) {
              found = value
            }
      }
    })
    return found;
  }

  private createChannel(member) {
    let c = new Channel();
    c.id = 0;
    c.owner_id = member.id;
    c.title = this.generateChannelTitle(member);
    c.type = 'S';
    let ci: ChannelInfo = {id: c.id, members: []};
    member.channel_type = 'S';
    ci.members.push(member)
    this.onChannel = c;
    this.mainview = false;
    this.channelInfo = ci;
  }

  generateChannelTitle(secondUser) {
    return this.userData.username + '//' + secondUser.username;
  }

  markChannelAsRead($event) {
    this.storage.removeUnreadChannelFromAppState($event);
    this.appState = this.storage.getAppState()
  }

  addToChannelMessages(message) {
    this.channelMessages.push(message)
  }

  getCurrentChannelMessage() {
    return this.channelMessages.filter(cm => cm.channel_id === this.onChannel.id)
  }

}
