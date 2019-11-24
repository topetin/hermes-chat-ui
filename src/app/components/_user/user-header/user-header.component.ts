import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {debounceTime, map, startWith} from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit {  

  @Input()name: string;
  @Input()profile_img: string;
  @Output() onLogout = new EventEmitter();
  @Output() onGoAccount = new EventEmitter();
  @Output() onGoChannel = new EventEmitter();

  searchInput = new FormControl('');
  filteredSearch: Subscription;
  results = new Array<any>();
  searching = false;
  optionSelected: any;

  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.subscribeSearch();
  }

  logout() {
    this.onLogout.emit('logout');
  }

  goAccount() {
    this.onGoAccount.emit('goAccount');
  }

  subscribeSearch() {
    this.filteredSearch = this.searchInput.valueChanges.pipe(
      startWith(null),
      debounceTime(400),
      map(
        searchString => {
          this.results = [];
          if (searchString && searchString.length > 0) {
          this.searching = true;
          this.userService.search(searchString).toPromise()
          .then(data => {
            this.processData(data.message)
            this.searching = false
          })
          .catch(error => {
            this.displayError(error)
            this.searching = false
          })
        }
      }
      )
    ).subscribe()
  }

  private displayError(err) {
    if(err.message) {
      return this._snackBar.open(err.message, 'OK', { duration: 2000 });
    }
    this._snackBar.open('There was a problem with your request.', 'OK', { duration: 2000 })
  }

  private processData(data) {
    this.results = [];
    data.users.map(user => this.results.push(user))
    data.channels.map(channel => this.results.push(channel))
  }

  formatLead(element: any) {
    return element.hasOwnProperty('name') ? element.name : '#'+ element.title
  }

  formatSecondary(element: any) {
    return element.hasOwnProperty('username') ? '@'+ element.username : ''
  }

  goToChannel() {
    if (this.optionSelected !== undefined) {
      Object.keys(this.results).forEach((key) => {
        if (
          (this.results[key].hasOwnProperty('name') && 
          (this.results[key].name.toLowerCase() === this.searchInput.value.toLowerCase() || this.results[key].username.toLowerCase() === this.searchInput.value.toLowerCase()))
        || (this.results[key].hasOwnProperty('title') &&
        this.results[key].title === this.searchInput.value.toLowerCase()) 
        ) {
          this.onGoChannel.emit(this.results[key]);
        }
      })
      this.searchInput.reset();
    }
  }

  loadOptionSelected($event) {
    this.onGoChannel.emit($event.option.value);
    this.searchInput.reset();
    this.optionSelected = undefined;
  }

}
