import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.css']
})
export class ActivateAccountComponent implements OnInit {

  email: string;
  hidePass1 = true;
  hidePass2 = true;
  requestingActivation = false;

  activationForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private registerService: RegisterService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
    if (!this.email) this.router.navigate(['**']);
    this.activationForm = this.fb.group({
      pass1: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(8)]),
      pass2: new FormControl('', [Validators.required])
    })
  }

  setPass2Validation() {
    this.activationForm.controls['pass2'].setValidators([Validators.required, Validators.pattern(`^${this.activationForm.value.pass1}$`)]);
  }

  goLogin(data?) {
    if (data) {
      return this.router.navigate(['login'], {state: {email: data}});
    }
    this.router.navigate(['login']);
  }

  validateForm() {
    if (this.activationForm.valid) {
      this.requestingActivation = true;
      this.registerService.activateAccount(this.email, this.activationForm.value.pass1)
      .subscribe(
        res => this.goLogin(this.email),
        err => this.displayError(err)
      )
      .add(() => this.requestingActivation = false)
    }
    Object.keys(this.activationForm.controls).forEach(field => this.activationForm.get(field).markAsTouched({ onlySelf: true }));
  }

  private displayError(err) {
    if(err.message) {
      if (err.message === false) {
        return this._snackBar.open('Unable to set password', 'OK', { duration: 2000 });
      }
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

}
