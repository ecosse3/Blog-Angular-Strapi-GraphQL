import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import USER_DATA from '../apollo/queries/user/user-data.js';
import COUNT_USER_ARTICLES from '../apollo/queries/user/count-user-articles.js';
import UPDATE_USER from '../apollo/mutations/user/update.js';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogUpdateBioComponent } from '../dialog-update-bio/dialog-update-bio.component';
import { DialogChangePasswordComponent } from './../dialog-change-password/dialog-change-password.component';
import { DialogChangeAvatarComponent } from '../dialog-change-avatar/dialog-change-avatar.component';

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
  userToken: any;

  private queryUserData: Subscription;
  private queryCountUserArticles: Subscription;

  constructor(
    private tokenStorageService: TokenStorageService,
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userData = this.tokenStorageService.getUser();
    this.userToken = this.tokenStorageService.getToken();

    this.route.paramMap.subscribe((params: ParamMap) => {
      if (this.userData.data.login.user.id === params.get('id')) {
        this.loggedUserProfile = true;
        this.id = this.userData.data.login.user.id;
        this.router.navigate(['/my-account', { redirect: true }]);
      } else if (params.get('id') === null) {
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

  userNotFound() {
    this.router.navigate(['/page-not-found']);
  }

  profilePhoto() {
    if (this.userLoading || this.userAdditionalData.user.avatar === null) {
      return 'http://localhost:1337/uploads/default-avatar.png';
    } else {
      return 'http://localhost:1337' + this.userAdditionalData.user.avatar.url;
    }
  }

  openUpdateBioDialog() {
    const dialogRef = this.dialog.open(DialogUpdateBioComponent, {
      width: '500px',
      height: '300px',
      disableClose: true,
      data: { bio: this.userAdditionalData.user.bio },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'close') {
        return;
      }

      if (result !== this.userAdditionalData.user.bio) {
        this.updateBio(this.id, result);
      } else {
        this.snackBar.open('Please change your bio to a new one!', 'Dismiss', {
          duration: 4000,
        });
      }
    });
  }

  updateBio(userid: number, newbio: string) {
    this.apollo
      .mutate({
        mutation: UPDATE_USER,
        variables: {
          input: {
            where: {
              id: userid,
            },
            data: {
              bio: newbio,
            },
          },
        },
      })
      .subscribe(
        (data) => {
          this.userAdditionalData.user.bio = newbio;
          this.snackBar.open('Your bio has been updated!', 'Dismiss', {
            duration: 4000,
          });
        },
        (error) => {
          this.snackBar.open(error, 'Dismiss', {
            duration: 4000,
          });
        }
      );
  }

  openChangePasswordDialog() {
    const dialogRef = this.dialog.open(DialogChangePasswordComponent, {
      width: '300px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'close') {
        return;
      }

      if (result !== this.userAdditionalData.user.bio) {
        // this.changePassword(this.id, result);
      }
    });
  }

  openChangeAvatarDialog() {
    const dialogRef = this.dialog.open(DialogChangeAvatarComponent, {
      width: '600px',
      height: '300px',
      disableClose: true,
      data: {
        avatar: this.userAdditionalData.user.avatar,
        token: this.userToken,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'close') {
        return;
      }

      if (result === 'delete') {
        this.deleteAvatar(this.id);
      }

      if (result !== 'close' && result !== 'delete') {
        this.changeAvatar(this.id, result[0]);
      }
    });
  }

  deleteAvatar(userid: number) {
    this.apollo
      .mutate({
        mutation: UPDATE_USER,
        variables: {
          input: {
            where: {
              id: userid,
            },
            data: {
              avatar: null,
            },
          },
        },
      })
      .subscribe(
        (data) => {
          this.userAdditionalData.user.avatar = null;
          this.snackBar.open('Your avatar has been removed!', 'Dismiss', {
            duration: 4000,
          });
        },
        (error) => {
          this.snackBar.open(error, 'Dismiss', {
            duration: 4000,
          });
        }
      );
  }

  changeAvatar(userid: number, data: any) {
    this.apollo
      .mutate({
        mutation: UPDATE_USER,
        variables: {
          input: {
            where: {
              id: userid,
            },
            data: {
              avatar: data.id,
            },
          },
        },
      })
      .subscribe(
        (data: any) => {
          this.snackBar.open('Your avatar has been changed!', 'Dismiss', {
            duration: 4000,
          });
        },
        (error) => {
          this.snackBar.open(error, 'Dismiss', {
            duration: 4000,
          });
        }
      );
  }
}
