import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo } from 'apollo-angular';
import LOGIN_MUTATION from '../apollo/mutations/auth/login.js';
import { AlertService } from '../alert/alert.service.js';

@Injectable()
export class AuthService {
  loginMutationQuery: Subscription;

  options = {
    autoClose: true,
  };

  constructor(private apollo: Apollo, private alert: AlertService) {}

  login(login: string, pass: string) {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: {
        input: {
          identifier: login,
          password: pass,
        },
      },
    });
  }

  logout() {
    this.loginMutationQuery.unsubscribe();
  }
}
