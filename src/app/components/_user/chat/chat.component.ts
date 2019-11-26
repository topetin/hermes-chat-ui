import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Channel } from 'src/app/models/Channel.model';
import { User } from 'src/app/models/User.model';
import { ChannelInfo } from '../user-main/user-main.component';
import { ChannelService } from 'src/app/services/channel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from "rxjs/operators";
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
import { ChannelMessage } from 'src/app/models/ChannelMessage.mode';
import * as moment from 'moment';
import { NotificationService } from 'src/app/services/notification.service';
import { Notification } from 'src/app/models/Notification.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {

  @ViewChild('chatScroll', {static: false}) private chat: ElementRef;
  @Input() channelData: Channel;
  @Input() userData: User;
  @Input() channelInfo: ChannelInfo;
  @Input() accountOpen: boolean;
  @Input() appState: any;
  @Input() messageList: any;
  @Input() currentChannelTyping: number;
  @Input() currentChannelNotTyping:boolean;

  displayMessageList = []
  users = {}
  message: string;
  showChannelInfo = false;
  channelDisplayInfo: ChannelInfo;
  removingUser = false;
  companyUsers: User[];
  user = new FormControl('');
  filteredUsers: Observable<any>;
  usersLoaded = false;
  optionSelected: any;
  singleChannelInfo: any;
  currentUserTyping: any;

  @Output() onChannelInfo = new EventEmitter();
  @Output() onChannelChange = new EventEmitter();
  @Output() onChannelDelete = new EventEmitter();
  @Output() onNewChannel = new EventEmitter();

  constructor(
    private channelService: ChannelService, 
    private _snackBar: MatSnackBar, 
    private userService: UserService,
    private chatService: ChatService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.getCompanyUsers();
    this.scrollToBottom();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
}

  private scrollToBottom(): void {
    try {

        this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.channelInfo && changes.channelInfo.currentValue) {
      this.channelDisplayInfo = undefined;
      this.channelDisplayInfo = Object.assign({}, changes.channelInfo.currentValue);
      if (this.channelDisplayInfo.members[0].channel_type === 'S') {
        this.singleChannelInfo = this.getSingleChannelInfo()
      }
    }
    if (changes.accountOpen) {
      if (this.showChannelInfo === true && changes.accountOpen.currentValue === true) {
        this.showChannelInfo = false;
      }
    }

    if (changes.messageList && changes.messageList.currentValue && changes.messageList.currentValue !== undefined) {
      this.displayMessageList =  changes.messageList.currentValue
      this.scrollToBottom()
    }

    if (changes.currentChannelTyping && changes.currentChannelTyping.currentValue) {
        this.currentUserTyping = this.findUserById(changes.currentChannelTyping.currentValue.user)
    }
  }

  findUserById(id) {
    let name = undefined;
    this.channelDisplayInfo.members.map((member) => {
      if (member.id === id) {
        name = member.name;
      }
    })
    if (name === undefined) {
      this.currentUserTyping = undefined;
    }
    return name;
  }

  getSingleChannelInfo() {
    let found;
    this.channelDisplayInfo.members.map((member) => {
      if (member.id !== this.userData.id) {
        found = member;
      }
    })
    return found;
  }

  private getCompanyUsers() {
    this.userService.getCompanyUsers().subscribe(
      data => {
        this.companyUsers = data
        this.filteredUsers = this.user.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
        this.usersLoaded = true;
      },
      error => { this.displayError(error); this.usersLoaded = true; }
    )
  }

  private _filter(value: string): any[] {
    if (value && value.length > 0) {
      const filterValue = value.toLowerCase();
      return this.companyUsers.filter(user => user.name.toLowerCase().includes(filterValue) || user.username.toLowerCase().includes(filterValue));
    }
    return this.companyUsers;
  }

  displayFn(val) {
    return val ? val.name : val;
  }

  addUser() {
    if (!this.optionSelected) {
      const userToAdd =this.isAnUser();
      if (userToAdd) {
        this.addMember(userToAdd.id);
        this.removeFromCompanyUsers(userToAdd)
      }
      this.user.reset();
      this.optionSelected = undefined;
    }
  }

  private isAnUser() {
    let user = null;
    if (this.user.value) {
      Object.keys(this.companyUsers).forEach((key) => {
        if (this.companyUsers[key].name.toLowerCase() === this.user.value.toLowerCase() || 
        this.companyUsers[key].username.toLowerCase() === this.user.value.toLowerCase() ) {
          user = this.companyUsers[key];
        }
      })
    }
    if (user && this.isAlreadyAdded(user)) {
      user = null;
    }
    return user;
  }

  loadOptionSelected($event) {
    if(this.isAlreadyAdded($event.option.value)) {
      this.user.reset();
      this.optionSelected = undefined;
      return;
    }
    this.optionSelected = $event.option.value
    this.addMember(this.optionSelected.id)
    this.removeFromCompanyUsers(this.optionSelected);
    this.user.reset();
    this.optionSelected = undefined;
  }

  addMember(userId) {
    this.channelService.addUser(this.channelData.id, userId).subscribe(
    data => {
      let n = this.generateNotification(`Te han agregado al canal #${this.channelData.title}`, this.channelData.id, userId.id)
      this.chatService.emitMemberRemoved(this.findSocketIdOnAppState(userId), n)
      this.onChannelChange.emit(this.channelData)
    },
      error => this.displayError(error)
    )
  }

  isAlreadyAdded(user) {
    let found = false;
    this.channelInfo.members.map((member) => {
      if (member.id === user.id) {
        found = true;
      }
    })
    return found;
  }

  private removeFromCompanyUsers(user) {
    this.companyUsers = this.companyUsers.filter(u => u.id !== user.id)
  }

  decodeTitle() {
    return this.channelData.type === 'G' ? '#' + this.channelData.title : this.singleChannelInfo.name
  }

  toggleChannelInfo() {
    this.showChannelInfo = !this.showChannelInfo;
    this.onChannelInfo.emit()
  }

  removeMemberFromChannel(userId) {
    this.removingUser = true;
    this.channelService.removeUser(this.channelInfo.id, userId.id)
    .subscribe(
      data => {
        let n = this.generateNotification(`Te han eliminado del canal #${this.channelData.title}`, this.channelData.id, userId.id)
        if (this.isOnline(userId)) {
          this.chatService.emitMemberRemoved(this.findSocketIdOnAppState(userId.id), n)
        } 
        this.notificationService.postNotification(n.company_id, n.channel_id, n.message, n.user_id)
          .subscribe(
            data => console.log(data),
            error => this.displayError(error)
          )
          this.onChannelChange.emit(this.channelData)
      },
      error => this.displayError(error)
    )
    .add(() => this.removingUser = false)
  }

  generateNotification(message, channelId, member) {
    let n = new Notification()
    n.company_id = this.channelData.id;
    n.channel_id = channelId;
    n.message = message;
    n.user_id = member;
    return n;
  }

  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  removeChannel() {
    this.channelService.removeChannel(this.channelInfo.id).subscribe(
      data => {
        this.channelInfo.members.map((member) => {
          let n = this.generateNotification(`Se ha eliminado el canal #${this.channelData.title}`, this.channelData.id, member.id)
          if (this.isOnline(member)) {
            this.chatService.emitMemberRemoved(this.findSocketIdOnAppState(member.id), n)
          } 
          this.notificationService.postNotification(
            this.userData.company_id, this.channelData.id, `Se ha eliminado el canal #${this.channelData.title}`, member.id)
            .subscribe(
              data => console.log(data),
              error => this.displayError(error)
            )
        })
        this.onChannelDelete.emit();
      },
      error => this.displayError(error)
    )
  }

  removeSingleChannel() {
    this.channelService.removeSingleChannel(
      this.channelData.id, 
      this.channelData.owner_id,
      this.singleChannelInfo.id,
      this.channelData.title)
      .subscribe(
        data => this.onChannelDelete.emit(),
        error => this.displayError(error)
      )
  }

    isSingleOnline() {
    let flag = false;
    this.appState.state.map((s) => {
      if (this.singleChannelInfo && s.userId === this.singleChannelInfo.id) {
        flag = true;
      }
    })
    return flag;
  }

  isOnline(member) {
    let flag = false;
    this.appState.state.map((s) => {
      if (s.userId === member.id) {
        flag = true;
      }
    })
    return flag;
  }

  sendMessage() {
    if (this.message !== '' && this.message !== undefined && this.message !== null) {
      let msg = this.initalizeMessage();
      if (this.channelData.id === 0) {
          this.channelService.createChannel(this.userData.id, 'S', this.generateChannelTitle(this.channelInfo.members[0]), [this.channelInfo.members[0].id]).subscribe(
            data => {
              this.chatService.emitMessageFromNewChannel(this.findSocketIdOnAppState(this.channelInfo.members[0].id), data.message)
              this.onNewChannel.emit(data.message)
              this.chatService.emitMessage(this.channelData.id, msg, this.userData.id)
              this.channelService.postMessage(this.userData.company_id, data.message.id, msg.message, this.userData.id)
              .subscribe(
                (data) => console.log(data),
                (error) => this.displayError(error))
            },
            error => this.displayError(error))
      }
      else {
        this.chatService.emitMessage(this.channelData, msg, this.userData.id)
        this.channelService.postMessage(this.userData.company_id, this.channelData.id, msg.message, this.userData.id)
        .subscribe(
          (data) => console.log(data),
          (error) => this.displayError(error))
        
      }
      this.message = undefined;
      this.onNotTyping()
      this.scrollToBottom()
    }
  }

  generateChannelTitle(secondUser) {
    return this.userData.username + '//' + secondUser.username;
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

  initalizeMessage() {
    let msg = new ChannelMessage();
    msg.channel_id = this.channelData.id;
    msg.company_id = this.userData.company_id;
    msg.at = moment().format();
    msg.id = 0;
    msg.message = this.message;
    msg.user_from_id = this.userData.id;
    return msg;
  }

  getUserImg(message) {
    let found;
    if (message.user_from_id === this.userData.id) {
      found = this.userData.profile_img;
    } else {
      this.channelDisplayInfo.members.map((member) => {
        if (member.id === message.user_from_id) {
          found = member.profile_img;
        }
      })
    }
    return found;
  }

  getUserName(message) {
    let found;
    if (message.user_from_id === this.userData.id) {
      found = 'Tu';
    } else {
      this.channelDisplayInfo.members.map((member) => {
        if (member.id === message.user_from_id) {
          found = member.name;
        }
      })
    }

    return found;
  }

  getTime(date) {
    return moment(date).format('LT')
  }
  
  getDate(date) {
    return moment(date).format('DD/MM/YYYY')
  }

  public onTyping() {
    this.chatService.emitTyping(this.channelData.id, this.userData.id);
  }

  public onNotTyping() {
    if (this.message === '' || this.message === undefined) {
      this.chatService.emitTyping(this.channelData.id, -1);
    }
  }

}
