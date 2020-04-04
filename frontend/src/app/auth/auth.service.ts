import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import LOGIN_MUTATION from '../apollo/mutations/auth/login.js';
import { AlertService } from '../alert/alert.service.js';
import { TokenStorageService } from './token-storage.service.js';

@Injectable()
export class AuthService {
  redirectUrl: string;

  options = {
    autoClose: true,
  };

  constructor(
    private apollo: Apollo,
    private alert: AlertService,
    private tokenStorageService: TokenStorageService
  ) {}

  get isLoggedIn(): boolean {
    return !!this.tokenStorageService.getToken();
  }

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
}
