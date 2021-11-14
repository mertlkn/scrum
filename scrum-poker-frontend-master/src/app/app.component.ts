import {Component, OnInit} from '@angular/core';
import { AuthService } from './core/service/auth.service';
import { Router } from '@angular/router';
import { TranslatorService } from './core/service/translator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'scrum-poker-frontend';
  private loggedIn:boolean;
  public window;

  
  constructor(private authService: AuthService,private router: Router, private translatorService: TranslatorService) {
   
    this.loggedIn=false;
    this.window=window;
    authService.loggedIn$.subscribe((status) => {
      if(status) {
        this.loggedIn=true;
      }
      else {
        this.router.navigate(['/login']);
      }
    })
  }

  public isSignedIn() {
    return this.loggedIn;
  }
  ngOnInit(): void {
  }
}
