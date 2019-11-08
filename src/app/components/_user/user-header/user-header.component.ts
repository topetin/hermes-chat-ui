import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {  

  @Input()name: string;
  @Input()profile_img: string;
  @Output() onLogout = new EventEmitter();
  @Output() onGoAccount = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  logout() {
    this.onLogout.emit('logout');
  }

  goAccount() {
    this.onGoAccount.emit('goAccount');
  }

}
