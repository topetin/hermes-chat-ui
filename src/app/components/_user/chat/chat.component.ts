import { Component, OnInit, Input } from '@angular/core';
import { Channel } from 'src/app/models/Channel.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  @Input() channelData: Channel;

  constructor() { }

  ngOnInit() {
    console.log(this.channelData)
  }

}
