import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../../core/service/auth.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { SignoutDialogComponent } from '../signout-dialog/signout-dialog.component';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateY(-0.5rem)', opacity: 0}),
          animate('500ms', style({transform: 'translateY(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateY(0)', opacity: 1}),
          animate('500ms', style({transform: 'translateY(-0.5rem)', opacity: 0}))
        ])
      ]
    )
  ]
})
export class HeaderComponent implements OnInit {

  @Input() name!: string;
  @Input() familyName!: string;
  @Input() avatar!: string;
  
  public hovered: boolean = false;
  faTimesCircle=faTimesCircle;
  dialogOpened = false;

  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) {
    authService.loggedIn$.subscribe((status) => {
      if(status) {
        this.name=authService.getBasicProfile().getGivenName();
        this.avatar=authService.getBasicProfile().getImageUrl();
        this.familyName=authService.getBasicProfile().getFamilyName();
      }
    })
  }

  public signoutEnter() {
    this.hovered=true;
  }

  public signoutLeave() {
    if(this.dialogOpened) {
      this.dialog.afterAllClosed.subscribe(() => {
        setTimeout(() => {
          this.hovered=false;
        },1000)
      })
    } else {
      setTimeout(() => {
        this.hovered=false;
      },1000)
    }

  }
  
  public openDialog() {
    const dialogRef = this.dialog.open(SignoutDialogComponent, {
      width: '250px',
    });
    this.dialogOpened = true;
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpened = false;
    });
  }

  ngOnInit(): void {
  }

}
