import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
    @Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {
    this.document.body.classList.add('bg-white-body');
  }

  ngOnDestroy(): void {
    this.document.body.classList.remove('bg-white-body');
  }

  goHome() {
    this.router.navigate(['']);
  }

}
