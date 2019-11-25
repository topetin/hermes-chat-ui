import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Channel } from 'src/app/models/Channel.model';
import { User } from 'src/app/models/User.model';
import { ChannelInfo } from '../user-main/user-main.component';
import { ChannelService } from 'src/app/services/channel.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map } from "rxjs/operators";
import { UserService } from 'src/app/services/user.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnChanges {

  @Input() channelData: Channel;
  @Input() userData: User;
  @Input() channelInfo: ChannelInfo;
  @Input() accountOpen: boolean;
  @Input() appState: any;

  messageList = []
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

  @Output() onChannelInfo = new EventEmitter();
  @Output() onChannelChange = new EventEmitter();
  @Output() onChannelDelete = new EventEmitter();

  constructor(private channelService: ChannelService, private _snackBar: MatSnackBar, private userService: UserService) { }

  ngOnInit() {
    this.getCompanyUsers();
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
      data => this.onChannelChange.emit(this.channelData),
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
    return this.channelData.type === 'G' ? '#' + this.channelData.title : this.decodeSingleChannelTitle()
  }

  decodeSingleChannelTitle() {
    let sc;
    this.channelInfo.members.map((member) => {
      if (member.id !== this.userData.id) {
        sc = member;
      }
    })
    return sc.name;
  }

  sendMessage() {}

  toggleChannelInfo() {
    this.showChannelInfo = !this.showChannelInfo;
    this.onChannelInfo.emit()
  }

  removeMemberFromChannel(userId) {
    this.removingUser = true;
    this.channelService.removeUser(this.channelInfo.id, userId.id)
    .subscribe(
      data => this.onChannelChange.emit(this.channelData),
      error => this.displayError(error)
    )
    .add(() => this.removingUser = false)
  }

  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  removeChannel() {
    this.channelService.removeChannel(this.channelInfo.id).subscribe(
      data => this.onChannelDelete.emit(),
      error => this.displayError(error)
    )
  }

  removeSingleChannel() {
    this.channelService.removeSingleChannel(
      this.channelData.id, 
      this.channelData.owner_id,
      this.singleChannelInfo.id,
      this.userData.id)
      .subscribe(
        data => this.onChannelDelete.emit(),
        error => this.displayError(error)
      )
  }

    isSingleOnline() {
    let flag = false;
    this.appState.ids.map((id) => {
      if (id === this.singleChannelInfo.id) {
        flag = true;
      }
    })
    return flag;
  }

  isOnline(member) {
    let flag = false;
    this.appState.ids.map((id) => {
      if (id === member.id) {
        flag = true;
      }
    })
    return flag;
  }

}
