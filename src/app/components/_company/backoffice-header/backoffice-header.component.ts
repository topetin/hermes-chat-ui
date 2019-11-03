import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-backoffice-header',
  templateUrl: './backoffice-header.component.html',
  styleUrls: ['./backoffice-header.component.css']
})
export class BackofficeHeaderComponent implements OnInit {

  @Input() name: string;
  @Input() profile_img: number;
  @Output() onTabChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  changeContent($event) {
    this.onTabChange.emit($event.index);
  }
}
