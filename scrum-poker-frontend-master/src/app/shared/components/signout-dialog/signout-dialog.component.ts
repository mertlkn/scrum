import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/core/service/auth.service';
@Component({
    selector: 'app-signout-dialog',
    templateUrl: './signout-dialog.component.html',
  })
  export class SignoutDialogComponent {
  
    constructor(public dialogRef: MatDialogRef<SignoutDialogComponent>,private authService: AuthService) {}

    public signout() {
        this.authService.logout()
    }
  
  }