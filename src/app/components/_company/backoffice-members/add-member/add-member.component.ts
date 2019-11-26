import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { BackofficeService } from 'src/app/services/backoffice.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {

  addMemeberForm: FormGroup;
  items: FormArray;


  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    private fb: FormBuilder,
    private registerService : RegisterService,
    private backofficeService: BackofficeService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.addMemeberForm = this.fb.group({
      items: this.fb.array([ this.createItem() ])
    })
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required])
    });
  }

  addItem(): void {
    this.items = this.addMemeberForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem($event) {
    const index = $event.srcElement.parentElement.parentElement.id
    this.items = this.addMemeberForm.get('items') as FormArray;
    this.items.removeAt(index);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  addMemebers() {
    this.items = this.addMemeberForm.get('items') as FormArray;
    if (this.addMemeberForm.valid) {
      this.backofficeService.addUsers(this.items.getRawValue()).subscribe(
        result => {
          if (result.message === true) {
            this.dialogRef.close('updateMembers')
          }
        },
        error => this.displayError(error)
      )
    }
  }

  private displayError(err) {
    if (err.message) {
      if (err.message.length) {
        return this._snackBar.open(err.message.join() + ' ya se ecuentra/n registrado/s', 'OK', { duration: 5000 });
      }
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

}
