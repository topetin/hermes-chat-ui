import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-pay',
  templateUrl: './success-pay.component.html',
  styleUrls: ['./success-pay.component.css']
})
export class SuccessPayComponent implements OnInit {

  @Input() username: string;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goHome() {
    this.router.navigate(['']);
  }

}
