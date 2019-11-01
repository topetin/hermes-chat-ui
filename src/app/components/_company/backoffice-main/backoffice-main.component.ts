import { Component, OnInit, ViewChild } from '@angular/core';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription } from 'src/app/models/Subscription.model';
import { BackofficeService } from 'src/app/services/backoffice.service';

@Component({
  selector: 'app-backoffice-main',
  templateUrl: './backoffice-main.component.html',
  styleUrls: ['./backoffice-main.component.css']
})
export class BackofficeMainComponent implements OnInit {

  userData: any;
  subscriptionData: Subscription;
  
  @ViewChild('tabs', {static: false}) tabs: MatTabGroup;

  constructor(
    private storage: AppStorageService,
    private backofficeService: BackofficeService) { }

  ngOnInit() {
    this.userData = this.storage.getStoredUser();
    this.getSubscriptionData();
  }

  changeContent($event) {
    this.tabs.selectedIndex = $event;
  }

  private getSubscriptionData() {
    this.backofficeService.getSubscription().subscribe(
      data => { this.subscriptionData =  data; },
      error => { console.log(error); }
    )
  }

}
