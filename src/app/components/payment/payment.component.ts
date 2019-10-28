import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  showInput: Boolean;
  paymentProcessed: Boolean;
  requestingSubscription: Boolean;
  username: string;

  constructor() { }

  ngOnInit() {
    this.showInput = true;
    this.paymentProcessed = false;
    this.requestingSubscription = false;
  }

  showSuccessPay($event) {
    this.username = $event;
    this.showInput = false;
    this.paymentProcessed = true;
  }

  showProgressBar($event) {
    this.requestingSubscription = $event;
  }

}
