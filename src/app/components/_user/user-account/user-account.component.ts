import { Component, OnInit, Inject, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/User.model';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProfileImageSelectorComponent } from '../../profile-image-selector/profile-image-selector.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../alert/alert.component';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit {

  @Input() userData: User;
  formUserData: User;
  changePasswordForm: FormGroup;
  password_actual: string;
  password_new_1: string;
  password_new_2: string;

  password = '**********';
  isUserModified = false;
  showPasswordChange = false;
  hidePassActual = true;
  hidePassNew1 = true;
  hidePassNew2 = true;

  @Output() onHideAccount = new EventEmitter();
  @Output() onAccountChange = new EventEmitter();
  @Output() onPasswordChange = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.formUserData = Object.assign({}, this.userData);
    this.changePasswordForm = this.fb.group({
      passActual: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(8)]),
      passNew1: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(8)]),
      passNew2: new FormControl('', [Validators.required])
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userData = changes.userData.currentValue;
  }

  markNameAsTouched($event) {
    this.isUserModified = this.formUserData.name !== this.userData.name
      || (this.changePasswordForm.value.passActual || this.changePasswordForm.value.passNew1 || this.changePasswordForm.value.passNew2);
  }

  resetData() {
    this.formUserData = Object.assign({}, this.userData);
    this.isUserModified = false;
    this.showPasswordChange = false;
    this.changePasswordForm.reset();
  }

  togglePasswordChange() {
    this.showPasswordChange = true;
    this.isUserModified = true;
  }

  setPassNew2Validation() {
    this.changePasswordForm.controls['passNew2'].setValidators([Validators.required, Validators.pattern(`^${this.changePasswordForm.value.passNew1}$`)]);
  }

  verifyPassNew2Validity() {
    return this.changePasswordForm.get('passNew2').invalid
  }

  hideAccount() {
    this.onHideAccount.emit('hideAccount')
  }

  changeProfileImage() {
    const dialogRef = this.dialog.open(ProfileImageSelectorComponent, {
      width: '450px',
      autoFocus: false,
      data: { currentProfileImage: this.formUserData.profile_img }
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) { this.onAccountChange.emit('refetchUser') }
      });
  }

  modifyUserData() {
    if (this.formUserData.name === this.userData.name) {
      if (this.changePasswordForm.valid) {
        this.userService.changePassword(this.changePasswordForm.value.passActual, this.changePasswordForm.value.passNew1)
          .subscribe(
            data => this.onPasswordChange.emit('logout'),
            error => this.displayError(error)
          )
        return;
      }
      Object.keys(this.changePasswordForm.controls).forEach(field => this.changePasswordForm.get(field).markAsTouched({ onlySelf: true }));
    }
    if (this.formUserData.name !== this.userData.name) {
      if (!this.changePasswordForm.value.passActual && !this.changePasswordForm.value.passNew1 && !this.changePasswordForm.value.passNew2) {
        this.showPasswordChange = false;
        this.changePasswordForm.reset();
        this.userService.changeName(this.formUserData.name)
          .then(
            data => this.confirmChanges()
          )
          .catch(
            error => this.displayError(error)
          )
        return;
      }
      if (this.changePasswordForm.valid) {
        this.userService.changeName(this.formUserData.name)
          .then(
            data => {
              this.userService.changePassword(this.changePasswordForm.value.passActual, this.changePasswordForm.value.passNew1)
                .subscribe(
                  data => this.onPasswordChange.emit('logout'),
                  error => this.displayError(error)
                )
            }
          )
          .catch(
            error => this.displayError(error)
          )
      } else {
        Object.keys(this.changePasswordForm.controls).forEach(field => this.changePasswordForm.get(field).markAsTouched({ onlySelf: true }));
      }
    }
  }

  private displayError(err) {
    if (err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  private confirmChanges() {
    this.onAccountChange.emit('refetchUser')
    this.dialog.open(AlertComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        type: 'check_circle',
        message: 'Cambios efectuados exitosamente'
      }
    })
  }

}
