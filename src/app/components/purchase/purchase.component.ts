import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

  goHome() {
    this.router.navigate(['']);
  }

  goPayment() {
    this.router.navigate(['./payment'], {relativeTo: this.route});
  }


}
