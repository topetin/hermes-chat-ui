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
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PaymentComponent } from './components/payment/payment.component';
import { SuccessPayComponent } from './components/payment/success-pay/success-pay.component';
import { InputPayComponent } from './components/payment/input-pay/input-pay.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { JwtModule } from '@auth0/angular-jwt';
import { BackofficeMainComponent } from './components/_company/backoffice-main/backoffice-main.component';
import { RoleGuardService } from './services/role-guard.service';
import { ActivateAccountComponent } from './components/activate-account/activate-account.component';
import { BackofficeHeaderComponent } from './components/_company/backoffice-header/backoffice-header.component';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PurchaseComponent,
    PageNotFoundComponent,
    PaymentComponent,
    SuccessPayComponent,
    InputPayComponent,
    LoginComponent,
    BackofficeMainComponent,
    ActivateAccountComponent,
    BackofficeHeaderComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '',  component: HomeComponent, canActivate: [AuthGuardService], data: {animation: 'Home' }},
      { path: 'login', component: LoginComponent, data: {animation: 'Login' } },
      { path: 'back-office', component: BackofficeMainComponent, canActivate: [RoleGuardService], data: { expectedRole: 'OWNER'} },
      { path: 'contratar', component: PurchaseComponent, data: {animation: 'Purchase' }},
      { path: 'contratar/payment', component: PaymentComponent },
      { path: 'activar-cuenta/:email', component: ActivateAccountComponent, pathMatch: 'full' , data: {animation: 'Activate' }},
      { path: '**', component: PageNotFoundComponent }
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["example.com"],
        blacklistedRoutes: ["example.com/examplebadroute/"]
      }
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatGridListModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
