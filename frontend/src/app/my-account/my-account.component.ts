import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  userData: string;
  userAvatar: any;

  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit() {
    this.userData = this.tokenStorageService.getUser();
    this.userAvatar = sessionStorage.getItem('USER-DATA');
  }
}
