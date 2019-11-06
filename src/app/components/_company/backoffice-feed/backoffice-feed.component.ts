import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Feed } from 'src/app/models/Feed.model';
import * as moment from 'moment';
import { FeedService } from 'src/app/services/feed.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-backoffice-feed',
  templateUrl: './backoffice-feed.component.html',
  styleUrls: ['./backoffice-feed.component.css']
})
export class BackofficeFeedComponent implements OnInit, OnChanges {

  @ViewChild('feeds', {static: false}) private chatScroll: ElementRef;
  @Input() name;
  @Input() profile_img;
  @Input() feedList: Feed[];
  @Output() onNewFeed = new EventEmitter();
  message: string;

  constructor(
    private feedService: FeedService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {  
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.feedList = changes.feedList.currentValue;
  }

  ngAfterViewChecked () {         
    this.scrollToBottom(); 
  }

  private scrollToBottom(): void {
    try {
        this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
    } catch(err) { }                 
}

sendMessage() {
  this.feedService.postFeed(this.message)
  .subscribe(
        data => this.onNewFeed.emit('refreshFeedData'),
        error => this.displayError(error)
      )
  this.message = undefined;
}

private displayError(err) {
  if(err.message) {
    return this._snackBar.open(err.message, 'OK', { duration: 2000 });
  }
  this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
}

getTime(date) {
  return moment(date).format('LT')
}

getDate(date) {
  return moment(date).format('DD/MM/YYYY')
}

}
