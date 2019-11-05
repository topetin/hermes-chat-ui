import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/User.model';
import { SelectionModel } from '@angular/cdk/collections';
import { BackofficeService } from 'src/app/services/backoffice.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddMemberComponent } from './add-member/add-member.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-backoffice-members',
  templateUrl: './backoffice-members.component.html',
  styleUrls: ['./backoffice-members.component.css']
})
export class BackofficeMembersComponent implements OnInit, OnChanges {

  @Input() membersData: User[];
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);
  @Output() onMemebersListChange = new EventEmitter();
  displayedColumns: string[] = ['selection', 'email', 'username', 'name', 'role_id', 'active', 'actions'];
  canChangeRole = false;

  constructor(
    private backofficeService: BackofficeService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<User>(this.membersData)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource<User>(changes.membersData.currentValue);
    this.selection = new SelectionModel<User>(true, []);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadSelection($event, row) {
    if ($event) {
      this.selection.toggle(row);
    }
    this.canChangeRole = this.verifyChangeRole();
    return null;
  }

  openAddMemberDialog() {
    let dialogref = this.dialog.open(AddMemberComponent, {
      width: '1000px',
      autoFocus: false
    })
    dialogref.afterClosed().subscribe((data) => this.onMemebersListChange.emit(true))
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

  deleteUsers(element?: User) {
    let dialogRef = this.dialog.open(AlertComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        type: 'warning',
        message: this.selection.selected.length > 0 ? `Desea eliminar los ${this.selection.selected.length} usuarios seleccionados?` : 'Desea eliminar este usuario?'
      }
    })
    dialogRef.afterClosed().subscribe(
      data => {
        if (data === true) {
          let req = element ? [element] : this.selection.selected;
          return this.backofficeService.deleteUsers(req)
          .subscribe(
            data => this.onMemebersListChange.emit(true),
            error => this.displayError(error)
          )
        }
        return;
      }
    )
  }

  resendInvitations(element?: User) {
    let req = element ? [element] : this.selection.selected;
    this.backofficeService.resendInvitations(req)
    .subscribe(
      data => {
        this.dialog.open(AlertComponent, {
          width: '400px',
          autoFocus: false,
          data: {
            type: 'check_circle',
            message: 'Invitaciones reenviadas exitosamente'
          }
        })
      },
      error => this.displayError(error)
    )
  }

  changeRole(role, element?: User) {
    let dialogRef = this.dialog.open(AlertComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        type: 'warning',
        message: this.selection.selected.length > 0 ? 
        `Desea cambiar el rol a ${this.decodeRole(role)} para los ${this.selection.selected.length} usuarios seleccionados?` 
        : `Desea cambiar el rol a ${this.decodeRole(role)} para este usuario?`
      }
    })
    dialogRef.afterClosed().subscribe(
      data => {
        if (data === true) {
          let req = element ? [element] : this.selection.selected;
          return this.backofficeService.changeRole(req, Number(role))
          .subscribe(
            data => this.onMemebersListChange.emit(true),
            error => this.displayError(error)
          )
        }
        return;
      }
    )
  }

  decodeActive(active) {
    return active === 0 ? 'Pendiente' : 'Activa';
  }

  private displayError(err) {
    console.log(err)
    if (err.message) {
      if (err.message.length) {
        return this._snackBar.open(err.message.join() + ' ya se ecuentra/n registrado/s', 'OK', { duration: 5000 });
      }
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  verifyChangeRole() {
    if (this.selection.selected.length) {
      const foo = this.selection.selected[0].role_id;
      const all = this.selection.selected.filter(item => {
        return item.role_id === foo;
      })
      return all.length === this.selection.selected.length;
    }
    }
}
