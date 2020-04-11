import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  NgxFileDropEntry,
  FileSystemFileEntry,
  FileSystemDirectoryEntry,
} from 'ngx-file-drop';
import { Apollo } from 'apollo-angular';
import UPLOAD_FILE_MUTATION from '../apollo/mutations/uploadFile/upload.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dialog-change-avatar',
  templateUrl: './dialog-change-avatar.component.html',
  styleUrls: ['./dialog-change-avatar.component.scss'],
})
export class DialogChangeAvatarComponent implements OnInit {
  files: NgxFileDropEntry[] = [];
  newAvatarData: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apollo: Apollo,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // Here you can access the real file
          console.log(droppedFile.relativePath, file);

          // You could upload it like this:
          const formData = new FormData();
          formData.append('files', file, droppedFile.relativePath);

          this.http
            .post('http://localhost:1337/upload', formData, {
              headers: new HttpHeaders().set(
                'Authorization',
                `Bearer ${this.data.token}`
              ),
            })
            .subscribe(
              (data) => {
                this.newAvatarData = data;
                console.log(data);
                this.snackBar.open(
                  'Your avatar has been uploaded!',
                  'Dismiss',
                  {
                    duration: 4000,
                  }
                );
              },
              (error) => {
                console.log(error);
                this.snackBar.open(error, 'Dismiss', {
                  duration: 4000,
                });
              }
            );

          //     this.apollo
          //       .mutate({
          //         mutation: UPLOAD_FILE_MUTATION,
          //         variables: {
          //           file: formData,
          //         },
          //         context: {
          //           useMultipart: true,
          //         },
          //       })
          //       .subscribe(
          //         (data) => {
          //           this.newAvatarData = data;
          //           this.snackBar.open(
          //             'Your avatar has been uploaded!',
          //             'Dismiss',
          //             {
          //               duration: 4000,
          //             }
          //           );
          //         },
          //         (error) => {
          //           console.log(error);
          //           this.snackBar.open(error, 'Dismiss', {
          //             duration: 4000,
          //           });
          //         }
          //       );
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }
}
