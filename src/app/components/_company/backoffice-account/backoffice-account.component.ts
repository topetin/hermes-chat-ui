import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'src/app/models/Subscription.model';
import { User } from 'src/app/models/User.model';
import * as moment from 'moment';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProfileImageSelectorComponent } from '../../profile-image-selector/profile-image-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-backoffice-account',
  templateUrl: './backoffice-account.component.html',
  styleUrls: ['./backoffice-account.component.css']
})
export class BackofficeAccountComponent implements OnInit, OnChanges {

  @Input() subscriptionData: Subscription;
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

  @Output() onProfileImgChange = new EventEmitter();
  @Output() onPasswordChange = new EventEmitter();

  constructor(private fb: FormBuilder, public dialog: MatDialog, private userService: UserService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.formUserData = Object.assign({}, this.userData);
    this.changePasswordForm = this.fb.group({
      passActual: new FormControl('', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-zA-Z]).{8,20}$'), Validators.minLength(8)]),
      passNew1: new FormControl('', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-zA-Z]).{8,20}$'), Validators.minLength(8)]),
      passNew2: new FormControl('', [Validators.required])
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.userData = changes.userData.currentValue;
  }

  decodeState() {
    return this.subscriptionData.active === 1 ? 'Activa' : 'Inactiva';
  }

  formatDate(date) {
    return moment(date).format('DD/MM/YYYY');
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

  cancelSubscription() {

  }

  changeProfileImage() {
    const dialogRef = this.dialog.open(ProfileImageSelectorComponent, {
      width: '450px',
      autoFocus: false,
      data: {
        currentProfileImage: this.formUserData.profile_img
      }
    });
    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.confirmChanges()
        }
      }
    )
  }
  private displayError(err) {
    if (err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  private confirmChanges() {
    this.onProfileImgChange.emit('refresh')
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
