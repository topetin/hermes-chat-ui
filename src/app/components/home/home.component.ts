import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AppStorageService } from 'src/app/services/app-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private storage: AppStorageService,
    private router: Router) { }

  ngOnInit() {
    if (this.storage.getStoredUser().role_id === 1) {
      return this.router.navigate(['/back-office'])
    }
    //que vaya a la view del chat
  }
}
