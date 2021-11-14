import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { JiraApiService } from '../../service/jira-api.service';

@Component({
  selector: 'app-callback-jira',
  templateUrl: './callback-jira.component.html',
  styleUrls: ['./callback-jira.component.css']
})
export class CallbackJiraComponent {

  code!: string;
  state!: string;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private router: Router, private jiraApiService: JiraApiService,private titleService: Title) {
    this.titleService.setTitle("Please wait, redirecting...");
    this.activatedRoute.queryParams.subscribe(params => {
      this.code=params.code;
      this.state=params.state;
    });
    this.getToken();
   }


  getToken(): void {    
    this.jiraApiService.login(this.code);
  }

}
