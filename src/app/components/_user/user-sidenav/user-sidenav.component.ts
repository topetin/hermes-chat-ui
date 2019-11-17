import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit {

  @Input() userRole: any;

  constructor() { }

  ngOnInit() {
  }

}
