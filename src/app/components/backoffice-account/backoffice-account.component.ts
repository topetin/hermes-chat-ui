import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'src/app/models/Subscription.model';
import { User } from 'src/app/models/User.model';
import * as moment from 'moment';

@Component({
  selector: 'app-backoffice-account',
  templateUrl: './backoffice-account.component.html',
  styleUrls: ['./backoffice-account.component.css']
})
export class BackofficeAccountComponent implements OnInit {

  @Input() subscriptionData: Subscription;
  @Input() userData: User;
  formUserData = this.userData ? Object.assign({}, this.userData) : null;
  password = '**********';
  isUserModified = false;

  constructor() { }

  ngOnInit() {
  }

  decodeState() {
    return this.subscriptionData.active === 1 ? 'Activa' : 'Inactiva';
  }

  formatDate(date) {
    return moment(date).format('DD/MM/YYYY');
  }

}
