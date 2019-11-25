import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';
import { Channel } from 'src/app/models/Channel.model';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

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

  groupChannels = new Array<Channel>();
  singleChannels = new Array<Channel>();
  displayChannel: Channel;
  @Output() onNewChannel = new EventEmitter();
  @Output() goChannel = new EventEmitter();
  @Output() goFeed = new EventEmitter();

  constructor(public dialog: MatDialog, @Inject(DOCUMENT) document) { }

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
        this.displayChannel = data.goChannel;
        this.scrollToItem();
        if (data.fetchChannels) {
          this.onNewChannel.emit(this.displayChannel);
        }
      }
    }
  )
  }

  goToChannel($event) {
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

}
