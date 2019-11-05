import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-backoffice-header',
  templateUrl: './backoffice-header.component.html',
  styleUrls: ['./backoffice-header.component.css']
})
export class BackofficeHeaderComponent implements OnInit {

  @Input() name: string;
  @Input() profile_img: number;
  @Output() onTabChange = new EventEmitter();
  @Output() onLogout = new EventEmitter();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  changeContent($event) {
    this.onTabChange.emit($event.index);
  }

  logout() {
    this.onLogout.emit('logout')
  }
}
