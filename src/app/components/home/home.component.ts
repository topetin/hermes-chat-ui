import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hide = true;
  loginForm: FormGroup

  constructor(
    private homeService: HomeService,
    private fb: FormBuilder,
    private router: Router
    ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    })
  }

  validateForm() {
    if (this.loginForm.valid) {
      return console.log('login')
    }
    Object.keys(this.loginForm.controls).forEach(field => this.loginForm.get(field).markAsTouched({ onlySelf: true }));
  }

  goPurchase() {
    this.router.navigate(['/contratar']);
  }

}
