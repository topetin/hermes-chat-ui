import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-input-pay',
  templateUrl: './input-pay.component.html',
  styleUrls: ['./input-pay.component.css']
})
export class InputPayComponent implements OnInit {

  isUsernameAvailable = false;
  requestingUsername = false;
  paymentForm: FormGroup;
  @Output() onSuccessPay = new EventEmitter();
  @Output() onRequestingSubscription = new EventEmitter();

  constructor(private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      card: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      cardName: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(4), Validators.maxLength(4)]),
      cvc: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(3), Validators.maxLength(4)])
    })
  }

  validateForm() {
    if (this.paymentForm.valid) {
      if (this.isUsernameAvailable) {
        this.onRequestingSubscription.emit(true);
        this.registerService.subscribeUser(
          this.paymentForm.value.name,
          this.paymentForm.value.email,
          this.buildInvoice())
          .subscribe(
            (res) => this.onSuccessPay.emit(res.message),
            (err) => this.showError(err)
          )
          .add(() => this.onRequestingSubscription.emit(false));
      }
    }
    Object.keys(this.paymentForm.controls).forEach(field => this.paymentForm.get(field).markAsTouched({ onlySelf: true }));
  }

  goHome() {
    this.router.navigate(['']);
  }

  validateUsername() {
    this.requestingUsername = true;
    if (this.paymentForm.value.email && this.paymentForm.get('email').valid) {
      this.registerService.isUsernameAvailable(this.paymentForm.value.email)
      .subscribe(
        res => this.isUsernameAvailable = true,
        err => this.isUsernameAvailable = false
        )
      .add(()=> this.requestingUsername = false)
    }
  }

  updateInput() {
    this.isUsernameAvailable = null;
  }

  private buildInvoice() {
    return '' + this.paymentForm.value.card + this.paymentForm.value.date + this.paymentForm.value.cvc + moment().format()
  }

  private showError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

}
