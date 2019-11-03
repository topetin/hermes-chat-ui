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
  displayedColumns: string[] = ['email', 'username', 'role_id', 'active', 'selection'];

  constructor(
    private backofficeService: BackofficeService,
    public dialog: MatDialog) { }

  ngOnInit() {
    console.log(this.membersData)
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openAddMemberDialog() {
    this.dialog.open(AddMemberComponent, {
      width: '1000px',
      autoFocus: false
    })
  }

}
