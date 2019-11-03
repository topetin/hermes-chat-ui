import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'src/app/models/Subscription.model';
import { User } from 'src/app/models/User.model';
import * as moment from 'moment';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ProfileImageSelectorComponent } from '../profile-image-selector/profile-image-selector.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-backoffice-account',
  templateUrl: './backoffice-account.component.html',
  styleUrls: ['./backoffice-account.component.css']
})
export class BackofficeAccountComponent implements OnInit {

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
      passActual: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(8)]),
      passNew1: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$'), Validators.minLength(8)]),
      passNew2: new FormControl('', [Validators.required])
    })
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
          //modify company name
          console.log('modify company name')
          return;
        }
      if (this.changePasswordForm.valid) {
        //modify company name and password
        console.log('modify company name and password')
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
            this.onProfileImgChange.emit(data);
          }
        }
      )
  }
  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

}
