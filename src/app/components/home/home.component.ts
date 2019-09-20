import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  hide = true;
  email = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  constructor(private homeService: HomeService) { }

  ngOnInit() {}



}
