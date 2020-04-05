import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { TokenStorageService } from '../auth/token-storage.service.js';
import CATEGORIES_QUERY from '../apollo/queries/category/categories.js';
import USER_DATA from '../apollo/queries/user/user-data.js';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  data: any = {};
  loading = true;
  errors: any;
  isLoggedIn = false;
  userData: any;
  userLoading = true;
  userErrors: any;

  private queryCategories: Subscription;
  private queryUserData: Subscription;

  constructor(
    private apollo: Apollo,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.queryCategories = this.apollo
      .watchQuery({
        query: CATEGORIES_QUERY,
      })
      .valueChanges.subscribe((result) => {
        this.data = result.data;
        this.loading = result.loading;
        this.errors = result.errors;
      });

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();

      this.queryUserData = this.apollo
        .watchQuery({
          query: USER_DATA,
          variables: {
            id: user.data.login.user.id,
          },
        })
        .valueChanges.subscribe((result) => {
          this.userData = result.data;
          this.userLoading = result.loading;
          this.userErrors = result.errors;
        });
    }
  }

  ngOnDestroy(): void {
    this.queryCategories.unsubscribe();
    this.queryUserData.unsubscribe();
  }

  logout() {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  profilePhoto() {
    if (this.userLoading || this.userData.user.avatar === null) {
      return 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png';
    } else {
      return 'http://localhost:1337' + this.userData.user.avatar.url;
    }
  }
}
