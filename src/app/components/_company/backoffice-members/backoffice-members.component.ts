import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/User.model';
import { SelectionModel } from '@angular/cdk/collections';
import { BackofficeService } from 'src/app/services/backoffice.service';

@Component({
  selector: 'app-backoffice-members',
  templateUrl: './backoffice-members.component.html',
  styleUrls: ['./backoffice-members.component.css']
})
export class BackofficeMembersComponent implements OnInit {

  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
  displayedColumns: string[] = ['email', 'username', 'role_id', 'active', 'selection'];

  constructor(private backofficeService: BackofficeService) { }

  ngOnInit() {
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

  test() {
    this.backofficeService.getSubscription()
    .subscribe(
      data => console.log(data),
      error => console.log(error)
    )
  }

}
