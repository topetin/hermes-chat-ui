import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from 'src/app/models/User.model';
import { Observable } from 'rxjs';
import { startWith, map } from "rxjs/operators";
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChannelService } from 'src/app/services/channel.service';

export interface AddChannelData {
  currentUserId: number;
}

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent implements OnInit {

  addChannelForm: FormGroup;
  companyUsers: User[];
  user: User;
  filteredUsers: Observable<any>;
  addedUsers = [];
  usersLoaded = false;
  creatingChannel = false;
  optionSelected: any;
  currentUserId: number;

  constructor(
    public dialogRef: MatDialogRef<AddChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddChannelData,
    private fb: FormBuilder,
    private userService: UserService,
    private channelService: ChannelService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.currentUserId = this.data.currentUserId;
    this.addChannelForm = this.fb.group({
      channelName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]),
      user: new FormControl('')
    })
    this.getCompanyUsers();
  }

  private getCompanyUsers() {
    this.userService.getCompanyUsers().subscribe(
      data => {
        this.companyUsers = data
        this.filteredUsers = this.addChannelForm.get('user').valueChanges
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

  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  addUser() {
    if (this.optionSelected) {
      this.addedUsers.push(this.optionSelected)
      this.removeFromCompanyUsers(this.optionSelected)
    } else {
      const userToAdd =this.isAnUser();
      if (userToAdd) {
        this.addedUsers.push(userToAdd)
        this.removeFromCompanyUsers(userToAdd);
      }
    }
    this.user === undefined;
    this.addChannelForm.get('user').reset();
    this.optionSelected = undefined;
  }

  private isAnUser() {
    let user = null;
    if (this.addChannelForm.value.user) {
      Object.keys(this.companyUsers).forEach((key) => {
        if (this.companyUsers[key].name.toLowerCase() === this.addChannelForm.value.user.toLowerCase() || 
        this.companyUsers[key].username.toLowerCase() === this.addChannelForm.value.user.toLowerCase() ) {
          user = this.companyUsers[key];
        }
      })
    }
    return user;
  }

  loadOptionSelected($event) {
    this.optionSelected = $event.option.value
    this.addedUsers.push(this.optionSelected);
    this.removeFromCompanyUsers(this.optionSelected);
    this.user === undefined;
    this.addChannelForm.get('user').reset();
    this.optionSelected = undefined;
  }

  private removeFromCompanyUsers(user) {
    this.companyUsers = this.companyUsers.filter(u => u.id !== user.id)
  }

  removeItem($event) {
    const index = $event.srcElement.parentElement.parentElement.id
    const deleted = this.addedUsers.splice(index, 1);
    this.companyUsers.push(deleted[0]);
    this.companyUsers.sort((a, b) => {
      if (a.name < b.name) {
        return 1;
    }
    if (a.name > b.name) {
        return -1;
    }
    return 0;
    })
  }

  addChannel() {
    this.creatingChannel = true;
    let members = this.addedUsers.map(user => user.id);
    this.channelService.createChannel(this.currentUserId, 'G', this.addChannelForm.value.channelName, members)
    .subscribe(
      data => this.dialogRef.close({fetchChannels: true, goChannel: data.message, addedUsers: members}),
      error => this.displayError(error)
    )
    .add(() => this.creatingChannel = false)
  }
}
