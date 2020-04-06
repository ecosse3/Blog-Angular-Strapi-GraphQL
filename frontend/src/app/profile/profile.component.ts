import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import USER_DATA from '../apollo/queries/user/user-data.js';
import COUNT_USER_ARTICLES from '../apollo/queries/user/count-user-articles.js';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  userData: any;
  userAdditionalData: any;
  userLoading = true;
  userErrors: any;
  userArticles: any;
  loggedUserProfile: boolean;
  id: any;

  private queryUserData: Subscription;
  private queryCountUserArticles: Subscription;

  constructor(
    private tokenStorageService: TokenStorageService,
    private apollo: Apollo,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userData = this.tokenStorageService.getUser();

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (
        this.userData.data.login.user.id === params.get('id') ||
        params.get('id') === null
      ) {
        this.loggedUserProfile = true;
        this.id = this.userData.data.login.user.id;
      } else {
        this.loggedUserProfile = false;
        this.id = params.get('id');
      }

      this.queryUserData = this.apollo
        .watchQuery({
          query: USER_DATA,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe((result) => {
          this.userAdditionalData = result.data;
          this.userLoading = result.loading;
          this.userErrors = result.errors;
        });

      this.queryCountUserArticles = this.apollo
        .watchQuery({
          query: COUNT_USER_ARTICLES,
          variables: {
            id: this.id,
          },
        })
        .valueChanges.subscribe((result) => {
          this.userArticles = result.data;
          this.userLoading = result.loading;
          this.userErrors = result.errors;
        });
    });
  }

  ngOnDestroy(): void {
    this.queryUserData.unsubscribe();
    this.queryCountUserArticles.unsubscribe();
  }

  profilePhoto() {
    if (this.userLoading || this.userAdditionalData.user.avatar === null) {
      return 'https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png';
    } else {
      return 'http://localhost:1337' + this.userAdditionalData.user.avatar.url;
    }
  }
}