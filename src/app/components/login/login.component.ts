import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true;
  loginForm: FormGroup;
  username: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
    if (history.state.email) {
      this.loginForm.removeControl('email');
      this.loginForm.addControl('email', new FormControl(history.state.email, [Validators.required]))
    }
  }

  validateForm() {
    if (this.loginForm.valid) {
      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then((res) => {
        this.router.navigate([''])
      })
      .catch((err) => {
        this.displayError(err);
      })
    }
    Object.keys(this.loginForm.controls).forEach(field => this.loginForm.get(field).markAsTouched({ onlySelf: true }));
  }

  goPurchase() {
    this.router.navigate(['/contratar']);
  }

  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

}
