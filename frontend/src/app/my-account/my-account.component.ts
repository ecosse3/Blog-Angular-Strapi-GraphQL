import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './../auth/token-storage.service';
import { AlertService } from '../alert/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  previousRoute: string;
  linkToProfile: any;

  constructor(
    private alert: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.previousRoute = this.route.snapshot.paramMap.get('redirect');
    if (this.previousRoute) {
      this.snackBar.open(
        'You have been redirected to your profile',
        'Dismiss',
        {
          duration: 5000,
        }
      );
    }
  }
}
