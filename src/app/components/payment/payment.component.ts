import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  showInput: Boolean;
  paymentProcessed: Boolean;

  constructor() { }

  ngOnInit() {
    this.showInput = true;
    this.paymentProcessed = false;
  }

  showSuccessPay($event) {
    this.showInput = false;
    this.paymentProcessed = true;
    console.log($event);
  }

}
