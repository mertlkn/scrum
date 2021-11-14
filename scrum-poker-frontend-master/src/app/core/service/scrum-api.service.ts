import { Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../../environments/environment';
import {Ticket} from '../../shared/model/ticket.model';
import {Session} from '../../shared/model/session.model';

@Injectable({
  providedIn: 'root'
})

export class ScrumApiService {
  private scrumApiEndPoint = environment.scrumApiEndPoint;
  constructor(private http: HttpClient, private  authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({'Content-Type': 'application/json' , authorization :
        this.authService.getIdToken()});
  }

  public createSession(session: Session): Promise<any> {
    return this.http.post(this.scrumApiEndPoint + 'session/', {
      sessionId: session.sessionId,
      adminId: session.adminId,
      sessionName: session.sessionName,
      currentTicketId: session.currentTicketId,
      ticketList: session.ticketList,
      revealVotes: session.revealVotes,
      issueCode: session.issueCode,
      cloudId: session.cloudId,
      voteType: session.voteType,
      activeUsers: session.activeUsers
    }, { headers: this.getHeaders()}).toPromise();
  }

  public getSession(sessionId: string): Promise<any> {
    return this.http.get(this.scrumApiEndPoint + 'session/' + sessionId, {headers: this.getHeaders()}).toPromise();
  }

  public isAdmin(sessionId: string): Promise<any> {
    return this.http.get(this.scrumApiEndPoint + 'session/check/' + sessionId, {headers: this.getHeaders()}).toPromise();
  }

  public updateSession(session: Session): Promise<any> {
    console.log(session.ticketList)
    return this.http.post(this.scrumApiEndPoint + 'session/update', {
      sessionId: session.sessionId,
      adminId: session.adminId,
      sessionName: session.sessionName,
      currentTicketId: session.currentTicketId,
      ticketList: session.ticketList,
      revealVotes: session.revealVotes,
      issueCode: session.issueCode,
      cloudId: session.cloudId,
      voteType: session.voteType,
      activeUsers: session.activeUsers
    }, { headers: this.getHeaders()}).toPromise();
  }

  public setFinalScore(ticket: Ticket, sessionId: string): Promise<any> {
    return this.http.post(this.scrumApiEndPoint + 'session/vote/' + sessionId, {
      ticketName: ticket.ticketName,
      ticketId: ticket.ticketId,
      ticketDesc: ticket.ticketDesc,
      userVoteList: ticket.userVoteList,
      ticketScore: ticket.ticketScore
    }, {headers: this.getHeaders()}).toPromise();
  }

}
