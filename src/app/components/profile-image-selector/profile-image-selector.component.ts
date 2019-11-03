import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DialogData {
  currentProfileImage: number;
}

@Component({
  selector: 'app-profile-image-selector',
  templateUrl: './profile-image-selector.component.html',
  styleUrls: ['./profile-image-selector.component.css']
})
export class ProfileImageSelectorComponent implements OnInit {

  currentProfileImage: string;
  pi = [
    'pi_1.svg',
    'pi_2.svg',
    'pi_3.svg',
    'pi_4.svg',
    'pi_5.svg',
    'pi_6.svg',
    'pi_7.svg',
    'pi_8.svg',
    'pi_9.svg',
    'pi_10.svg',
    'pi_11.svg',
    'pi_12.svg',
    'pi_13.svg',
    'pi_14.svg',
    'pi_15.svg',
    'pi_16.svg',
    'pi_17.svg',
    'pi_18.svg'
  ]

  constructor(
    public dialogRef: MatDialogRef<ProfileImageSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.currentProfileImage = 'pi_' + this.data.currentProfileImage + '.svg';
  }

  changeProfilePicture() {
    console.log(this.currentProfileImage.slice(2).split('.'))
    this.userService.changeProfileImg(Number(this.currentProfileImage.split('_')[1].split('.')[0]))
    .then(
      data => this.dialogRef.close('refresh')
    )
    .catch(
      error => this.displayError(error)
    )
  }

  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

}
