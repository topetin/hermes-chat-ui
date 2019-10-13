import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentForm: FormGroup;

  constructor(private fb: FormBuilder,
    private router: Router) { }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      company: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      card: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      name: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(4), Validators.maxLength(4)]),
      cvc: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(3), Validators.maxLength(4)])
    })
  }

  validateForm() {
    if (this.paymentForm.valid) {
      return console.log('login')
    }
    Object.keys(this.paymentForm.controls).forEach(field => this.paymentForm.get(field).markAsTouched({ onlySelf: true }));
  }

  goHome() {
    this.router.navigate(['']);
  }

}
