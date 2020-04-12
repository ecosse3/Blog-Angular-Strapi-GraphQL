import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import MyGoogleChartsSettings from './app-maps-api-key';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArticlesComponent } from './articles/articles.component';
import { MarkdownModule } from 'ngx-markdown';
import { ArticleComponent } from './article/article.component';
import { CategoryComponent } from './category/category.component';
import { LoginComponent } from './login/login.component';
import { AuthService } from './auth/auth.service';
import { AlertModule } from './alert/alert.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { FooterComponent } from './footer/footer.component';
import { ProfileComponent } from './profile/profile.component';
import { DialogUpdateBioComponent } from './dialog-update-bio/dialog-update-bio.component';
import { DialogChangePasswordComponent } from './dialog-change-password/dialog-change-password.component';
import { DialogChangeAvatarComponent } from './dialog-change-avatar/dialog-change-avatar.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { MyTravelsComponent } from './my-travels/my-travels.component';
import * as _ from 'lodash-es';

import { CommonModule } from '@angular/common';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { VisitedCountriesComponent } from './traveler-zone/visited-countries/visited-countries.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ArticlesComponent,
    ArticleComponent,
    CategoryComponent,
    HomeComponent,
    LoginComponent,
    PageNotFoundComponent,
    MyAccountComponent,
    FooterComponent,
    ProfileComponent,
    DialogUpdateBioComponent,
    DialogChangePasswordComponent,
    DialogChangeAvatarComponent,
    MyTravelsComponent,
    VisitedCountriesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    GraphQLModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    BrowserAnimationsModule,
    RouterModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    AlertModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    NgxFileDropModule,
    Ng2GoogleChartsModule,
    MatSelectCountryModule,
    MatSortModule,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    AuthService,
    {
      provide: 'googleChartsSettings',
      useValue: MyGoogleChartsSettings,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'pl-PL' },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogUpdateBioComponent,
    DialogChangePasswordComponent,
    DialogChangeAvatarComponent,
  ],
})
export class AppModule {}
