import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hide = true;
  loginForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService
    ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  validateForm() {
    if (this.loginForm.valid) {
      if (this.registerService.loginUser(this.loginForm.value.email, this.loginForm.value.password) !== null) {
        this.console.log()
      }
    }
    Object.keys(this.loginForm.controls).forEach(field => this.loginForm.get(field).markAsTouched({ onlySelf: true }));
  }

  goPurchase() {
    this.router.navigate(['/contratar']);
  }

}
