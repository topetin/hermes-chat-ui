import { Component, OnInit, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/User.model';
import { SelectionModel } from '@angular/cdk/collections';
import { BackofficeService } from 'src/app/services/backoffice.service';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberComponent } from './add-member/add-member.component';

@Component({
  selector: 'app-backoffice-members',
  templateUrl: './backoffice-members.component.html',
  styleUrls: ['./backoffice-members.component.css']
})
export class BackofficeMembersComponent implements OnInit {

  @Input() membersData: User[];
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
  displayedColumns: string[] = ['selection', 'email', 'username', 'name', 'role_id', 'active', 'actions'];

  constructor(
    private backofficeService: BackofficeService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.membersData)
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadSelection($event, row) {
    if ($event) {
      this.selection.toggle(row);
    }
    return null;
  }

  openAddMemberDialog() {
    this.dialog.open(AddMemberComponent, {
      width: '1000px',
      autoFocus: false
    })
  }

  decodeRole(role) {
    switch(role) {
      case 1:
        return 'OWNER';
      case 2:
        return 'ADMINISTRATOR';
      case 3:
        return 'USER'
    }
  }

  decodeActive(active) {
    return active === 0 ? 'Pendiente' : 'Activa';
  }

}
