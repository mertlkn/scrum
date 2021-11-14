import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CreateSessionComponent } from '../create-session/create-session.component';
import { environment } from 'src/environments/environment';
import { JiraApiService } from 'src/app/core/service/jira-api.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public logInForm: FormGroup;
  public jira: boolean = false;
  public jira_logged_in: boolean = false;

  constructor(
    private router: Router, 
    public dialog: MatDialog, 
    private http: HttpClient,
    private jiraApiService: JiraApiService,
    private titleService: Title
    ) {

    this.titleService.setTitle("Scrum Poker");
    this.logInForm = new FormGroup({
      pin: new FormControl('', [Validators.required]),
    });
    if(jiraApiService.getAccessToken()) {      
      let token_deadline = new Date(localStorage.getItem("token_deadline") || "");      
      if(token_deadline > new Date()) {
        this.jira_logged_in = true;
      }
    }
  }

  ngOnInit(): void {}

  public goSession(): void {
    if (this.logInForm.valid) {
      this.router.navigate(['poker'], {
        queryParams: { s: this.logInForm.get('pin')?.value },
      });
    }
  }

  public clearInput(inputId: string): void {
    this.logInForm.get(inputId)?.reset();
  }

  public openDialogCustom(): void {
    const dialogRef = this.dialog.open(CreateSessionComponent, {
      width: '90vw',
      height: '34vw',
      data: {
        jira : false
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  public openDialogJira(): void {
    this.jira = true;
    const dialogRef = this.dialog.open(CreateSessionComponent, {
      width: '90vw',
      height: '34vw',
      data: {
        jira : this.jira
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  public redirectToJira() {
    window.location.href = "https://auth.atlassian.com/authorize?" +
    "audience=" + environment.jira.audience +
    "&client_id=" + environment.jira.client_id +
    "&scope=" + environment.jira.scope +
    "&redirect_uri=" + environment.jira.redirect_uri +
    "&state=" + environment.jira.state +
    "&response_type=" + environment.jira.response_type +
    "&prompt=" + environment.jira.prompt;
  }

  public disconnectJira() {
    this.jiraApiService.logout();
    this.jira_logged_in = false;
  }
}
