import { Component, OnInit, ViewChild } from '@angular/core';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-backoffice-main',
  templateUrl: './backoffice-main.component.html',
  styleUrls: ['./backoffice-main.component.css']
})
export class BackofficeMainComponent implements OnInit {

  userData: any;
  
  @ViewChild('tabs', {static: false}) tabs: MatTabGroup;

  constructor(private storage: AppStorageService) { }

  ngOnInit() {
    this.userData = this.storage.getStoredUser();
  }

  changeContent($event) {
    this.tabs.selectedIndex = $event;
  }

}
