import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {

  addMemeberForm: FormGroup;
  arrayItems
  requestingEmail = false;
  isEmailAvailable = false;

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    private fb: FormBuilder,
    private registerService : RegisterService
  ) { }

  ngOnInit() {
    this.addMemeberForm = this.fb.group({
      times: this.fb.array([
        this.initTimes()
      ])
    })
  }

  validateEmail() {
    if (this.addMemeberForm.value.email && this.addMemeberForm.get('email').valid) {
      this.requestingEmail = true;
      this.registerService.isUsernameAvailable(this.addMemeberForm.value.email)
      .subscribe(
        res => this.isEmailAvailable = true,
        err => this.isEmailAvailable = false
        )
      .add(()=> this.requestingEmail = false)
    }
  }

  updateInput() {
    this.isEmailAvailable = null;
  }

  initTimes() {
    return this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      role: new FormControl('', [Validators.required]),
      trackingId: this.generateUniqueId()
    })
  }

  generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  addGroup() {
    // add address to the list
    const control = <FormArray>this.addMemeberForm.controls['times'];
    control.push(this.initTimes());
  }

  removeGroup(i: number) {
    // remove address from the list
    const control = <FormArray>this.addMemeberForm.controls['times'];
    control.removeAt(i);
  }

}
