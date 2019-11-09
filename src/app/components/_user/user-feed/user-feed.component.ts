import { Component, OnInit, Input } from '@angular/core';
import { Feed } from 'src/app/models/Feed.model';
import * as moment from 'moment';

@Component({
  selector: 'app-user-feed',
  templateUrl: './user-feed.component.html',
  styleUrls: ['./user-feed.component.css']
})
export class UserFeedComponent implements OnInit {

  @Input() feedData: Feed[];
  @Input() companyImage: any;

  constructor() { }

  ngOnInit() {
  }

  getTime(date) {
    return moment(date).format('LT')
  }
  
  getDate(date) {
    return moment(date).format('DD/MM/YYYY')
  }

}
