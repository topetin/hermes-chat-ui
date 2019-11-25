import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
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
import { StorageServiceModule } from 'ngx-webstorage-service';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatBadgeModule} from '@angular/material/badge';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

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
import { AppStorageService } from './services/app-storage.service';
import { BackofficeFeedComponent } from './components/_company/backoffice-feed/backoffice-feed.component';
import { BackofficeMembersComponent } from './components/_company/backoffice-members/backoffice-members.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { BackofficeAccountComponent } from './components/_company/backoffice-account/backoffice-account.component';
import { ProfileImageSelectorComponent } from './components/profile-image-selector/profile-image-selector.component';
import { AddMemberComponent } from './components/_company/backoffice-members/add-member/add-member.component';
import { AlertComponent } from './components/alert/alert.component';
import { ChatComponent } from './components/_user/chat/chat.component';
import { UserMainComponent } from './components/_user/user-main/user-main.component';
import { UserHeaderComponent } from './components/_user/user-header/user-header.component';
import { UserAccountComponent } from './components/_user/user-account/user-account.component';
import { UserSidenavComponent } from './components/_user/user-sidenav/user-sidenav.component';
import { UserFeedComponent } from './components/_user/user-feed/user-feed.component';
import { AddChannelComponent } from './components/_user/add-channel/add-channel.component';
import { ChatService } from './services/chat.service';

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
    BackofficeHeaderComponent,
    BackofficeFeedComponent,
    BackofficeMembersComponent,
    BackofficeAccountComponent,
    ProfileImageSelectorComponent,
    AddMemberComponent,
    AlertComponent,
    ChatComponent,
    UserMainComponent,
    UserHeaderComponent,
    UserAccountComponent,
    UserSidenavComponent,
    UserFeedComponent,
    AddChannelComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '',  component: HomeComponent, canActivate: [AuthGuardService], data: {animation: 'Home' }},
      { path: 'login', component: LoginComponent, data: {animation: 'Login' } },
      { path: 'back-office', component: BackofficeMainComponent, canActivate: [RoleGuardService], data: { expectedRole: '1'} },
      { path: 'app', component: UserMainComponent, canActivate: [RoleGuardService], data: { expectedRole: '2'} },
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
    MatMenuModule,
    StorageServiceModule,
    MatTabsModule,
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule, 
    MatTooltipModule,
    MatSelectModule,
    MatBadgeModule,
    MatAutocompleteModule
  ],
  entryComponents: [
    ProfileImageSelectorComponent,
    AddMemberComponent,
    AlertComponent,
    UserAccountComponent,
    AddChannelComponent
  ],
  providers: [AppStorageService, ChatService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
