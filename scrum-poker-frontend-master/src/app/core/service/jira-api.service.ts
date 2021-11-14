import { HttpClient } from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import { Router } from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {environment} from '../../../environments/environment';
import { CookieService } from 'ngx-cookie';

@Injectable({
    providedIn: 'root'
  })
  

export class JiraApiService {

    private access_token!: string;
    private jiraApiEndPoint = environment.scrumApiEndPoint;

    constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

    public setFinalScoreJira(issueCode: string, issueNumber: string, cloudId: string, score: string): Promise<any> { 
        console.log(issueNumber)
        return this.http.put(this.jiraApiEndPoint + 'jira/vote/' + issueCode + '-' + issueNumber,{}, {
          params: {
            cloudId: cloudId
          },
          headers: {
            //@ts-ignore
            access_token : this.getAccessToken(),
            //@ts-ignore
            token_type : localStorage.getItem("token_type"),
            storyPoint : score
          }
        }).toPromise();
        
      }


    public retrieveIssues(cloudId: string): Promise<any> {  
        return this.http.get(this.jiraApiEndPoint + 'jira/get',{
            params: {
              cloudId: cloudId
            },
            headers : {
            access_token : this.getAccessToken() || "",
            token_type : localStorage.getItem("token_type") || ""
            }
        }).toPromise();
    }

    public setAccessToken(access_token: string) {
        this.access_token = access_token;
        this.cookieService.put('access_token',this.access_token);
    }

    public getAccessToken(): string {
        this.access_token = this.cookieService.get('access_token');
        return this.access_token;
    }
    
    public login(code: string) {
      this.http.post('https://auth.atlassian.com/oauth/token',{
          grant_type: "authorization_code",
          client_id: environment.jira.client_id,
          client_secret: environment.jira.client_secret,
          code: code,
          redirect_uri: environment.jira.redirect_uri
        }).toPromise().then((response) => {
          //@ts-ignore
          this.setAccessToken(response.access_token);
          //@ts-ignore
          localStorage.setItem("scope",response.scope);
          //@ts-ignore
          localStorage.setItem("expires_in",response.expires_in);
          //@ts-ignore
          localStorage.setItem("token_type",response.token_type);
          let temp = new Date();
          //@ts-ignore
          temp.setSeconds(temp.getSeconds() + response.expires_in);
          localStorage.setItem("token_deadline",temp.toString());
          this.router.navigateByUrl("dashboard");
        })
    }

    public logout() {
      this.setAccessToken('');
      localStorage.setItem("scope",'');
      localStorage.setItem("expires_in",'');
      localStorage.setItem("token_type",'');
      let temp = new Date();
      localStorage.setItem("token_deadline",temp.toString());
    }
        
}