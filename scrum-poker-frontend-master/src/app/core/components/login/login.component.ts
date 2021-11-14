import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../service/auth.service';
import {Router} from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router, private titleService: Title) { 
    this.titleService.setTitle("Login");
  }

  ngOnInit(): void {
  }

  public  signIn(): void {
    this.authService.login();
    this.authService.loggedIn$.subscribe((response) => {
      if(response) {
        this.router.navigateByUrl("dashboard");
      }
    })
  }
}
