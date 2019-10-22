import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SuccessPayComponent } from './components/payment/success-pay/success-pay.component';
import { InputPayComponent } from './components/payment/input-pay/input-pay.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PurchaseComponent,
    PageNotFoundComponent,
    PaymentComponent,
    SuccessPayComponent,
    InputPayComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: '',  component: HomeComponent, data: {animation: 'Home'}},
      {path: 'contratar', component: PurchaseComponent, data: {animation: 'Purchase'}},
      { path: 'contratar/payment', component: PaymentComponent },
      { path: '**', component: PageNotFoundComponent }
    ]),
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
