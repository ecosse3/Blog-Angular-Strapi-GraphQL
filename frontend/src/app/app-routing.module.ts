import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleComponent } from './article/article.component';
import { CategoryComponent } from './category/category.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { MyAccountComponent } from './my-account/my-account.component';
import { ProfileComponent } from './profile/profile.component';
import { MyTravelsComponent } from './my-travels/my-travels.component';
import { VisitedCountriesComponent } from './traveler-zone/visited-countries/visited-countries.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'article/:id', component: ArticleComponent },
  {
    path: 'category/:id',
    component: CategoryComponent,
  },
  {
    path: 'my-account',
    component: MyAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-travels',
    component: MyTravelsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'traveler-zone/visited-countries',
    component: VisitedCountriesComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
