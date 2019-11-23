import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { Channel } from 'src/app/models/Channel.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit, OnChanges {

  @Input() userRole: any;
  @Input() userId: number;
  @Input()userChannels: Channel[];

  groupChannels = new Array<Channel>();
  privateChannels = new Array<Channel>();
  displayChannel: Channel;
  @Output() onNewChannel = new EventEmitter();
  @Output() goChannel = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userChannels.currentValue) {
      this.processChannels(changes.userChannels.currentValue);
    }
  }

  processChannels(value: Channel[]) {
    this.groupChannels.length = 0;
    this.privateChannels.length = 0;
    value.map(val => {
      val.type === 'G' ? this.groupChannels.push(val) : this.privateChannels.push(val);
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
        this.displayChannel = data.goChannel;
        if (data.fetchChannels) {
          this.onNewChannel.emit(this.displayChannel);
        }
      }
    }
  )
  }

}
