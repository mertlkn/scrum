import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from 'src/app/shared/model/ticket.model';
import { Session } from '../../../../shared/model/session.model';
import { ScrumApiService } from '../../../../core/service/scrum-api.service';
import {AuthService} from '../../../../core/service/auth.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Issue } from 'src/app/shared/model/issue.model';
import { HttpClient } from '@angular/common/http';
import { JiraApiService } from 'src/app/core/service/jira-api.service';
import { VoteTypes } from 'src/app/shared/model/vote-types';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.scss'],
})
export class CreateSessionComponent implements OnInit {

  nameValue = '';
  ticketForm: FormGroup;
  sessionForm: FormGroup;
  isEditing = false;
  editingIndex = 0;
  issues:Issue[];
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  

  session: Session = {
    sessionId: '',
    adminId: '',
    sessionName: '',
    currentTicketId: '',
    ticketList: [],
    revealVotes: false,
    issueCode: '',
    cloudId: '',
    voteType: 0,
    activeUsers: []
  };



  tickets:Ticket[];
  lang: any;
  jira: any;
  domains: any;
  jiraProjectSelected: any;
  issueCode: string = "";
  voteTypes: any[] = [];
  voteTypesSelected: any;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private scrumApiService: ScrumApiService,
    private router: Router,
    private dialogRef: MatDialogRef<CreateSessionComponent>,
    private activatedRoute : ActivatedRoute,
    private http: HttpClient,
    private jiraApiService: JiraApiService,
    @Inject(MAT_DIALOG_DATA) public data: {jira: boolean}
  ) {
    this.ticketForm = new FormGroup({
      ticketName: new FormControl(''),
      ticketDescription: new FormControl(''),
      ticketNo: new FormControl(''),
    })

    this.sessionForm = new FormGroup({
      sessionName: new FormControl('',Validators.required),
      voteType: new FormControl('',Validators.required)
    })


    this.tickets=[];
    this.issues=[];
    this.jira = data.jira;

    if(this.jira) {
      http.get("https://api.atlassian.com/oauth/token/accessible-resources",{
        headers: {
          Authorization : localStorage.getItem("token_type") + " " + jiraApiService.getAccessToken(),
          Accept : "application/json"
        }
      }).toPromise().then(response => {
        //@ts-ignore
        this.domains = response;
        this.jiraProjectSelected = this.domains[0].id;
        this.retrieveIssues(this.jiraProjectSelected);
      });
    }

    this.voteTypes.push(VoteTypes.type0,VoteTypes.type1,VoteTypes.type2,VoteTypes.type3);
    this.voteTypesSelected = this.voteTypes[0];
  }

  ngOnInit(): void {
    this.ticketForm.get('ticketName')?.valueChanges.subscribe(() => {
      if(this.ticketForm.get('ticketName')?.dirty) {
        this.isValid();
        if(this.ticketForm.get('ticketName')?.value==="") {
          this.ticketForm.get('ticketName')?.setErrors(null);
        }
      }
    })
    this.ticketForm.get('ticketNo')?.valueChanges.subscribe(() => {
      if(this.ticketForm.get('ticketName')?.dirty) {
        this.isValid();
        this.ticketForm.get('ticketName')?.setErrors(null);
      }
    })
  }

  public addNewTicket(): void {
    if (this.isValid()) {
      const newTicket: Ticket = {
        ticketName:this.ticketForm.get('ticketName')?.value,
        ticketId: this.ticketForm.get('ticketNo')?.value,
        ticketDesc: this.ticketForm.get('ticketDescription')?.value,
        ticketScore: '',
        userVoteList: [],
      }

      this.tickets.push(newTicket);
      this.ticketForm.reset()
    }

  }

  public deleteTicket(ticketIndex: number): void {
    let deletedTicket = this.tickets[ticketIndex];
    if(this.jira) {
      const deletedIssue: Issue = {
        issueName:deletedTicket['ticketName'],
        issueNumber: deletedTicket['ticketId'],
        issueDescription: deletedTicket['ticketDesc'],
        issueCode: this.issueCode,
      }
      this.issues.push(deletedIssue);
    }
    this.tickets.splice(ticketIndex,1);
  }

  public editTicket(ticketIndex: number): void {
    this.isEditing=true;
    this.editingIndex = ticketIndex;
    this.ticketForm.get('ticketName')?.setValue(this.tickets[ticketIndex].ticketName)
    this.ticketForm.get('ticketNo')?.setValue(this.tickets[ticketIndex].ticketId)
    this.ticketForm.get('ticketDescription')?.setValue(this.tickets[ticketIndex].ticketDesc)
  }

  public saveTicket(): void {
    if(this.isValid()) {
      const newTicket: Ticket = {
        ticketName:this.ticketForm.get('ticketName')?.value,
        ticketId: this.ticketForm.get('ticketNo')?.value,
        ticketDesc: this.ticketForm.get('ticketDescription')?.value,
        ticketScore: '',
        userVoteList: [],
      }
      this.tickets[this.editingIndex] = newTicket;
      this.isEditing = false;
      this.ticketForm.reset()
    }
  }

  private resetErrors(formControl: FormGroup): void {
    Object.keys(formControl.controls).forEach((key) => {
      formControl.get(key)?.setErrors(null);
    });
  }

  public saveSession(): void {
    this.session = {
      sessionId: '',
      adminId: this.authService.getBasicProfile().getId(),

      sessionName:this.sessionForm.get('sessionName')?.value,
      currentTicketId: this.tickets[0].ticketId,

      ticketList:this.tickets,
      revealVotes: false,
      issueCode: this.issueCode,
      cloudId: this.jiraProjectSelected,
      voteType: this.voteTypesSelected,
      activeUsers: []
    };
    this.activatedRoute.queryParams.subscribe(params => {
      this.lang=params.lang;
    })
    this.scrumApiService.createSession(this.session).then((result) => {
      this.dialogRef.close();
      setTimeout(() => {
        if(this.lang==="en" || this.lang==="tr") {
          this.router.navigate(['poker'], {
            queryParams: { s: result.sessionId, lang: this.lang },
          });
        } else {
          this.router.navigate(['poker'], {
            queryParams: { s: result.sessionId},
          });
        }
      },500)
    });
  }

  isCompleted() {   
    if(this.tickets.length===0 || this.sessionForm.get('sessionName')?.value==="" || this.sessionForm.get('voteType')?.value==="") {
      return false;
    }
    return true;
  }

  isValid() {
    let ticketName:String;
    let ticketNo:String;
    let notInvalid=true;
    ticketName=this.ticketForm.get('ticketName')?.value;
    ticketNo=this.ticketForm.get('ticketNo')?.value;
    if(ticketName.length<4) {
      if(ticketName.length!==0) {
        this.ticketForm.get('ticketName')?.setErrors({'incorrect':true})
      }
      notInvalid=false;
    }
    if(ticketNo.length<1 || !ticketNo.match('^[0-9]*$')) {
      if(ticketNo.length!==0) {
        this.ticketForm.get('ticketNo')?.setErrors({'incorrect':true})
        notInvalid=false;
      }
    }
    return notInvalid;
  }

  public retrieveIssues(cloudId: string) {
    let response = this.jiraApiService.retrieveIssues(cloudId).then(res => {
        this.issues = res;
        this.issueCode = this.issues[0].issueCode;
    });
    
  }



  public addTicketJira(i:number): void {
    const newTicket: Ticket = {
      ticketName:this.issues[i]['issueName'],
      ticketId: this.issues[i]['issueNumber'],
      ticketDesc: this.issues[i]['issueDescription'],
      ticketScore: '',
      userVoteList: [],
    }
    this.issues.splice(i,1);
    this.tickets.push(newTicket);
  }
}


