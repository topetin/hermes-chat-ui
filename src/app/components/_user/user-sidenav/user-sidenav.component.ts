import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddChannelComponent } from '../add-channel/add-channel.component';

@Component({
  selector: 'app-user-sidenav',
  templateUrl: './user-sidenav.component.html',
  styleUrls: ['./user-sidenav.component.css']
})
export class UserSidenavComponent implements OnInit {

  @Input() userRole: any;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openAddChannelDialog() {
    this.dialog.open(AddChannelComponent, {
      width: '400px',
      disableClose: true,
      data: {}
    })
  }

}
