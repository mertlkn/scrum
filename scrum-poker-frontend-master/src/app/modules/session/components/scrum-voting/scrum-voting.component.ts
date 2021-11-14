import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Ticket } from '../../../../shared/model/ticket.model';
import { ScrumApiService } from '../../../../core/service/scrum-api.service';
import { Session } from '../../../../shared/model/session.model';
import { ActivatedRoute, Router } from '@angular/router';
import {UserVote} from '../../../../shared/model/user-vote.model';
import {AuthService} from '../../../../core/service/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import { MatDrawerMode } from '@angular/material/sidenav';
import { VoteOptions } from '../../../../shared/model/vote-options';
import { VoteTypes } from '../../../../shared/model/vote-types';
import { ActiveUser } from 'src/app/shared/model/active-user.model';
import { Subject } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { faCheck, faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { JiraApiService } from 'src/app/core/service/jira-api.service';

@Component({
  selector: 'app-scrum-voting',
  templateUrl: './scrum-voting.component.html',
  styleUrls: ['./scrum-voting.component.scss'],
  styles: [`
  /deep/ app-header.sidenav-header .avatar-container {
    float: initial;
  }
  `],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({opacity: 0}),
          animate('500ms', style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate('500ms', style({opacity: 0}))
        ])
      ]
    ),
    trigger(
      'overlayAnimation', [
        state('show', style({
          opacity: 1
        })),
        state('hide',style({
          opacity: 0
        })),
        transition('show => hide', animate('600ms ease-out')),
        transition('hide => show', animate('600ms ease-in'))
      ]
    )
  ],
})
export class ScrumVotingComponent implements OnInit, OnDestroy {
  public sessionId = '';
  public sidenavOpened:boolean=false;
  public sidenavPinned:boolean=false;
  public sidenavLocked:boolean=false;
  public overlayOpened:boolean=false;
  public isActiveUserNames:boolean=false;
  public finalVoteSent = false;
  public sidenavMode:MatDrawerMode="over";
  score = 0;
  public voteChange: Subject<Ticket[]> = new Subject<Ticket[]>();
  public revealChange: Subject<boolean> = new Subject<boolean>();
  public receivedSession: Subject<boolean> = new Subject<boolean>();
  public overlay!: Overlay;

  currentTicket: Ticket = {
    ticketName : '',
    ticketId : '',
    ticketDesc : '',
    ticketScore : '',
    userVoteList: []
  };
  public votes: UserVote[] = [];
  public currentVote : string = "0";
  public revealVotes = false;
  public voteOptions: VoteOptions[] = [];
  public session: Session = {
    sessionId: '',
    adminId: '',
    sessionName: '',
    currentTicketId: '',
    revealVotes: false,
    ticketList: [],
    issueCode: '',
    cloudId: '',
    voteType: 0,
    activeUsers: []
   };

  private errorCount = 0;
  public isAdmin = false;
  public isSessionLoading = true;
  public ticketDesc = '';
  private lang!: string;
  private subscription: any;
  public avatar: string = "";
  public basicProfile: any;
  public lastTicketId = "";
  currentLang: any;
  changeTo: any;
  subs: any;
  faThumbtack = faThumbtack;
  faCheck = faCheck;

  constructor(
    private scrumApiService: ScrumApiService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private store: AngularFirestore,
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private translate: TranslateService,
    private titleService: Title,
    private jiraApiService: JiraApiService
  ) {
    this.titleService.setTitle("Session");
    this.handleLanguage();
  }

  ngOnInit(): void {
    this.startSession();
    this.activatedRoute.queryParams.subscribe(params => {
      this.lang=params.lang;
    })
    this.avatar = this.authService.getBasicProfile().getImageUrl();

  }

  startSession(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.sessionId = params['s'];
    })
    this.getSession(this.sessionId).then(() => {
      this.scrumApiService.isAdmin(this.sessionId).then(result => {
        this.isAdmin = result;
        this.activateUser()
      });
      this.basicProfile = this.authService.getBasicProfile();
      this.titleService.setTitle(this.session.sessionName);
      this.receivedSession.next(true);
      this.store.collection('sessions').doc(this.sessionId).valueChanges().subscribe(res => { 
        this.lastTicketId = JSON.parse(JSON.stringify(this.session.currentTicketId));
        // @ts-ignore
        this.session.ticketList = JSON.parse(JSON.stringify(res.ticketList));
        // @ts-ignore
        this.session.currentTicketId = JSON.parse(JSON.stringify(res.currentTicketId));
        // @ts-ignore
        this.revealChange.next(res.revealVotes);
        // @ts-ignore
        this.session.revealVotes = JSON.parse(JSON.stringify(res.revealVotes));
        // @ts-ignore
        this.revealVotes = JSON.parse(JSON.stringify(res.revealVotes));
        // @ts-ignore
        this.session.activeUsers = JSON.parse(JSON.stringify(res.activeUsers));
        this.session.ticketList.forEach((ticket) => {
          if (ticket.ticketId === this.session.currentTicketId) {
            // @ts-ignore
            /*this.isVotesChanged(this.currentTicket,ticket);
            this.currentTicket = JSON.parse(JSON.stringify(ticket));
            if(this.lastTicketId!==this.currentTicket.ticketId) {
              this.voteChange.next("")
            }*/
            let tempTicket = JSON.parse(JSON.stringify(this.currentTicket));
            this.currentTicket = JSON.parse(JSON.stringify(ticket));
            this.isVotesChanged(tempTicket,ticket);
            if(this.lastTicketId!==this.currentTicket.ticketId) {
              this.voteChange.next([tempTicket,this.currentTicket])
            }
          }
        }); 
        this.titleService.setTitle(this.session.sessionName+" > "+this.currentTicket.ticketName);
        this.votedForThisTicket();
        
      });
  });    
  }

  votedForThisTicket() { 
    let tempVoted = false;
    this.session.ticketList.forEach((ticket) => {
      if(ticket.ticketId === this.session.currentTicketId) {
          ticket.userVoteList.forEach((vote) => {
            if(vote.userId === this.authService.getBasicProfile().getId() && vote.userVote!=="-404") {
              tempVoted = true;
              this.score = +vote.userVote;
            }
          })
      }
    })
    return tempVoted;
  }

   getSession(sessionId: string): any {
    return this.scrumApiService.getSession(sessionId).then((res) => {
      this.session = res;
      this.isSessionLoading = false;
      this.revealChange.next(this.session.revealVotes);
      this.determineVoteType();
      }).catch((error) => {
        if(this.errorCount<=10) {
          this.errorCount+=1;
          this.getSession(sessionId);
        } else {
          console.log(error);
        }
      });
      
  }


  public setTicket(ticket: Ticket): void {   
    if (this.isAdmin && this.currentTicket.ticketId !== ticket.ticketId) {      
      this.voteChange.next([this.currentTicket,ticket]);
      this.currentTicket = ticket;
      this.session.currentTicketId = ticket.ticketId;
      this.session.revealVotes = false;
      this.revealVotes = false;
      this.finalVoteSent = false;
      this.scrumApiService.updateSession(this.session).then();
    }
  }


  ngOnDestroy(): void {
    this.deactivateUser();
  }



  public gotodashboard() {
    if(this.lang==="en" || this.lang==="tr") {
      this.router.navigate(['dashboard'], {
        queryParams: {lang: this.lang },
      });
    }
    else {
      this.router.navigate(['dashboard']);
    }
  }

  private determineVoteType() {
    if(this.session.voteType===1) {
      this.voteOptions = VoteTypes.type1.voteOptions;
    } else if(this.session.voteType===2) {
      this.voteOptions = VoteTypes.type2.voteOptions;
    } else if(this.session.voteType===3) {
      this.voteOptions = VoteTypes.type3.voteOptions;
    } else {
      this.voteOptions = VoteTypes.type0.voteOptions;
    }
  }

  activateUser(): void {
    let activated = false;
    this.session.activeUsers.forEach(activeUser => {
      if(activeUser.userId === this.basicProfile.getId()) {
        activated = true;
      }
    })
    if(!activated) {
      let user: ActiveUser = {
        userId : this.basicProfile.getId(),
        userName : this.basicProfile.getName(),
        userAvatar : this.basicProfile.getImageUrl()
      }
      this.session.activeUsers.push(user);
      this.scrumApiService.updateSession(this.session).then()
    }
  }

  @HostListener('window:unload', [ '$event' ])
  deactivateUser(): void {  
    this.session.activeUsers = this.session.activeUsers.filter(activeUser => {
      if(activeUser.userId === this.basicProfile.getId()) {
        return false;
      }
      return true;
    })
    
    this.scrumApiService.updateSession(this.session).then()
  }

  isVotesChanged(currentTicket:Ticket, newTicket: Ticket) {
    if(newTicket.userVoteList.length > currentTicket.userVoteList.length) {
      this.voteChange.next([currentTicket,newTicket]);
    } else {
      currentTicket.userVoteList.forEach(vote => {
        newTicket.userVoteList.forEach(newVote => {
          if(vote.userId === newVote.userId && vote.userVote !== newVote.userVote) {
            this.voteChange.next([currentTicket,newTicket]);
          }
        })
      })
    }
  }

  isVotesEqual(vote1: UserVote, vote2: UserVote): boolean {
    if(vote1 === null) return false;
    if(vote2 === null || (vote1.userId === vote2.userId && vote1.userVote === vote2.userVote)) {
      return true;
    }
    return false;
  }

  public pinChange(bool: boolean) {
    this.sidenavPinned=bool;    
  }

  sidenavOpen() {
    if(!this.sidenavLocked) {
      this.sidenavOpened=true;
    }
  }

  sidenavClose() {    
    if(!this.sidenavPinned) {     
      this.sidenavOpened=false;
    };
  }

  sidenavLockChange() {
    this.sidenavLocked = !this.sidenavLocked;
  }

  public overlayOpen() {    
    this.overlayOpened = true;

  }

  public overlayClose() {    
      this.overlayOpened = false;
  }

  public handleLanguage() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.currentLang=params.lang;
      if(this.currentLang==="en") {
        this.changeTo="tr";
      } else if(this.currentLang==="tr"){
        this.changeTo="en";
      } else {
        this.currentLang=this.translate.getBrowserLang();
        this.currentLang === "en" ? this.changeTo="tr" : this.changeTo="en";
      }
    })
  }

  public changeLanguage() {
    this.subs=this.activatedRoute.queryParams.subscribe(params => {
      let oldparams;
      oldparams=params;

      this.router.navigate([],{
        //@ts-ignore
        queryParams: {s:oldparams.s,lang:this.changeTo}
      })
    })
    this.subs.unsubscribe();

  }

  public activateUserName(i: number) {
    var activeUser = document.querySelector(`.active-user:nth-child(${i+2}) div b`);
    activeUser?.setAttribute('style','opacity: 100%')
  }

  public deactivateUserName(i: number) {
    var notActiveUser = document.querySelector(`.active-user:nth-child(${i+2}) div b`);
    notActiveUser?.setAttribute('style','opacity: 0%')
  }

  public activateUserNameNotActive(i: number) {
    var notActiveUser = document.querySelector(`.not-active-user:nth-child(${i+4}) div b`);
    notActiveUser?.setAttribute('style','opacity: 100%')
  }

  public deactivateUserNameNotActive(i: number) {
    var activeUser = document.querySelector(`.not-active-user:nth-child(${i+4}) div b`);
    activeUser?.setAttribute('style','opacity: 0%')
  }
  
  get overlayStatus() {
    return this.overlayOpened ? 'show' : 'hide';
  }

  public sendFinalVote(vote: string): void {
    const sessionId = this.session.sessionId;
    const ticketToSend: Ticket = {
      ticketName: this.currentTicket.ticketName,
      ticketId: this.currentTicket.ticketId,
      ticketDesc: this.currentTicket.ticketDesc,
      ticketScore: vote,
      userVoteList: this.currentTicket.userVoteList,
    };

    this.scrumApiService.setFinalScore(ticketToSend, sessionId).then((res) => {

    });
    if(vote==="") {
      this.finalVoteSent = false;
    } else {
      this.finalVoteSent = true;
    }
    if(this.session.issueCode !== "") {
      this.jiraApiService.setFinalScoreJira(this.session.issueCode, ticketToSend.ticketId,this.session.cloudId, ticketToSend.ticketScore);
    }
  }

  public checkIfVoted(userId: string): boolean {
    let userAlreadyVoted = false;
    this.currentTicket.userVoteList.forEach(vote => {
      if(vote.userId === userId && vote.userVote!=="-404") {
        userAlreadyVoted = true;
      }
    })    
    return userAlreadyVoted;
  }

  get notActiveUsers() {
    let notActiveUsers = this.currentTicket.userVoteList.filter(vote => {
      let userIsActive = false;
      this.session.activeUsers.forEach(activeUser => {
        if(activeUser.userId === vote.userId) {
          userIsActive = true;
        }
      })
      return !userIsActive && vote.userVote!=="-404";
    })
    return notActiveUsers;
  }
}
