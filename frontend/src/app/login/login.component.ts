import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { Apollo } from 'apollo-angular';
import { AuthService } from '../auth/auth.service';
import { TokenStorageService } from '../auth/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;
  submitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private apollo: Apollo
  ) {
    if (this.authService.isLoggedIn) {
      if (this.authService.redirectUrl) {
        this.router.navigateByUrl(this.authService.redirectUrl);
      } else {
        this.router.navigate(['/my-account']);
      }
    }
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService
      .login(this.f.username.value, this.f.password.value)
      .subscribe(
        (data) => {
          this.tokenStorage.saveToken(data);
          this.tokenStorage.saveUser(data);

          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.loading = false;

          window.location.reload();
        },
        (error) => {
          this.alertService.error(error);
          this.loading = false;
          this.isLoginFailed = true;
        }
      );
  }
}
