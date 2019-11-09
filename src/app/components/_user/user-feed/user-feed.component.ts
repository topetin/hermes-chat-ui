import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Feed } from 'src/app/models/Feed.model';
import * as moment from 'moment';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {

  @ViewChild('feeds', {static: false}) private chatScroll: ElementRef;
  @Input() feedData: Feed[];
  @Input() companyImage: any;
  @Input() companyName: any;

  constructor() { }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked () {         
    this.scrollToBottom(); 
  }

  private scrollToBottom(): void {
    try {
        this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
    } catch(err) { }                 
}

  getTime(date) {
    return moment(date).format('LT')
  }
  
  getDate(date) {
    return moment(date).format('DD/MM/YYYY')
  }


  test($event) {
    console.log($event)
  }
}
