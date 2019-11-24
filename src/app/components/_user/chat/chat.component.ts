import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Channel } from 'src/app/models/Channel.model';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() channelData: Channel;
  @Input() userData: User;

  messageList = []
  users = {}
  message: string;
  showChannelInfo = false;

  @Output() onChannelInfo = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  decodeTitle() {
    return this.channelData.type === 'G' ? '#' + this.channelData.title : '@' + this.decodeSingleChannelTitle()
  }

  decodeSingleChannelTitle() {
    let titleArr = this.channelData.title.split('//')
    return this.channelData.owner_id === this.userData.id ? titleArr[1] : titleArr[0]
  }

  sendMessage() {}

  toggleChannelInfo() {
    this.showChannelInfo = !this.showChannelInfo;
    this.onChannelInfo.emit()
  }

}
