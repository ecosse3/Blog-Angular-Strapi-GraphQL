import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-update-bio',
  templateUrl: './dialog-update-bio.component.html',
  styleUrls: ['./dialog-update-bio.component.scss'],
})
export class DialogUpdateBioComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
