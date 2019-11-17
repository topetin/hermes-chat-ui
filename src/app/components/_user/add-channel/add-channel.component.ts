import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

export interface AddChannelData {

}

@Component({
  selector: 'app-add-channel',
  templateUrl: './add-channel.component.html',
  styleUrls: ['./add-channel.component.css']
})
export class AddChannelComponent implements OnInit {

  addChannelForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddChannelData,
    private fb: FormBuilder 
  ) { }

  ngOnInit() {
    this.addChannelForm = this.fb.group({
      channelName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]*$')]),
      member: new FormControl('')
    })
  }

}
