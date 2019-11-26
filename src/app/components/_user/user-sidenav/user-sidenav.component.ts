import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { Channel } from 'src/app/models/Channel.model';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { ChannelInfo } from '../user-main/user-main.component';
import { Notification } from 'src/app/models/Notification.model';
import { NotificationService } from 'src/app/services/notification.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit, OnChanges {

  @Input() userRole: any;
  @Input() userId: number;
  @Input() userChannels: Channel[];
  @Input() onChannel: Channel;
  @Input() appState: any;
  @Input() companyId: any;
  @Input() notifications: Notification[];
  @Input() notiNotViewed: boolean;

  groupChannels = new Array<Channel>();
  singleChannels = new Array<Channel>();
  displayChannel: Channel;
  displayNotifications = new Array<Notification>();

  @Output() onNewChannel = new EventEmitter();
  @Output() goChannel = new EventEmitter();
  @Output() goFeed = new EventEmitter();
  @Output() onReadChannel = new EventEmitter();

  constructor(public dialog: MatDialog, @Inject(DOCUMENT) document,
  private notificationService: NotificationService,
  private chatService: ChatService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (changes.onChannel && changes.userChannels && changes.userChannels.currentValue && changes.userChannels.currentValue.length) {
      this.processChannels(changes.userChannels.currentValue);
      this.displayChannel = changes.onChannel.currentValue;
      this.scrollToItem()
      return;
    }
    if (changes.userChannels && changes.userChannels.currentValue && changes.userChannels.currentValue.length) {
      this.processChannels(changes.userChannels.currentValue);
    }
    if (changes.onChannel && changes.onChannel.currentValue) {
      this.displayChannel = changes.onChannel.currentValue;
      this.scrollToItem()
    }
  }

  updateNotifications() {
    console.log(this.notifications)
    this.notiNotViewed = false;
    if (this.notifications.length > 0) {
      let arr = [];
      this.notifications.map((n) => {
        arr.push(n.id)
      })

      this.notificationService.updateNotifications()
      .subscribe(
        data => console.log(data),
        error => console.log(error)
      )
    }

  }

  private scrollToItem(): void {
    try {
      document.getElementById(this.displayChannel.id+'').scrollIntoView({ block: 'end',  behavior: 'smooth' });
    } catch(err) { }                 
}

  processChannels(value: Channel[]) {
    this.groupChannels.length = 0;
    this.singleChannels.length = 0;
    value.map(val => {
      val.type === 'G' ? this.groupChannels.push(val) : this.singleChannels.push(val);
    });
  }

  openAddChannelDialog() {
    const dialogRef = this.dialog.open(AddChannelComponent, {
      width: '400px',
      disableClose: true,
      data: {
        currentUserId: this.userId
      }
    })
  dialogRef.afterClosed().subscribe(
    data => {
      if (data) {
        data.addedUsers.map((member) => {
          let n = this.generateNotification(`Te han agregado al canal #${data.goChannel.title}`, data.goChannel.id, member)
          this.chatService.emitMemberRemoved(this.findSocketIdOnAppState(member), n)
          this.notificationService.postNotification(n.company_id, n.channel_id, n.message, n.user_id)
            .subscribe(
              data => console.log(data),
              error => console.log(error)
            )
        })
        this.displayChannel = data.goChannel;
        this.scrollToItem();
        if (data.fetchChannels) {
          this.onNewChannel.emit(this.displayChannel);
        }
      }
    }
  )
  }

  findSocketIdOnAppState(id){
    let found;
    this.appState.state.map((s) => {
      if (s.userId === id) {
        found = s.socketId
      }
    })
    return found;
  }

  goToChannel($event) {
    if (this.isUnreadChannel($event)) {
      this.onReadChannel.emit($event)
    }
    this.displayChannel = $event;
    this.goChannel.emit($event)
  }

  goToFeed() {
    this.displayChannel = undefined;
    this.goFeed.emit()
  }

  decodeTitle(chan: Channel) {
    let arr = chan.title.split('//');
    return this.userId === chan.owner_id ? arr[1] : arr[0]
  }

  check(sc) {
    return sc.id === this.displayChannel.id
  }

  isUnreadChannel(channel) {
    let flag = false;
    this.appState.unreadChannels.map((chan) => {
      if (chan.id === channel.id) {
        flag = true;
      }
    })
    return flag;
  } 

  generateNotification(message, channelId, member) {
    let n = new Notification()
    n.company_id = this.companyId;
    n.channel_id = channelId;
    n.message = message;
    n.user_id = member;
    return n;
  }

  // isUserOnline(channel: Channel) {
  //   var found = undefined;
  //   this.allChannelsInfo.map((chan) => {
  //     console.log(chan)
  //     console.log(channel)
  //     if (chan.id === channel.id) {
  //       chan.members.map((member) => {
  //         if (member.id !== this.userId) {
  //           found = member.id;
  //           console.log(found)
  //         }
  //       })
  //     }
  //   })
  //   let flag = false;
  //   this.appState.ids.map((id) => {
  //     if (id === found) {
  //       console.log(id)
  //       flag = true;
  //     }
  //   })
  //   return flag;
  // }

}
