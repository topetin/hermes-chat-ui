import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-pay',
  templateUrl: './input-pay.component.html',
  styleUrls: ['./input-pay.component.css']
})
export class InputPayComponent implements OnInit {

  paymentForm: FormGroup;
  @Output() onSuccessPay = new EventEmitter();

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
      this.onSuccessPay.emit('email');
    }
    Object.keys(this.paymentForm.controls).forEach(field => this.paymentForm.get(field).markAsTouched({ onlySelf: true }));
  }

  goHome() {
    this.router.navigate(['']);
  }

}
