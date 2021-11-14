import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../../core/service/auth.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html'
})
export class SetupComponent implements OnInit {
// in this component we should check whether the user has signed or not.
  constructor(private router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.isSigned(loggedIn);
    });
  }

  isSigned(loggedIn: boolean): void {
    if (loggedIn) {
      this.router.navigate(['dashboard']);
    } else {
      this.router.navigate(['login']);
    }
  }

}
