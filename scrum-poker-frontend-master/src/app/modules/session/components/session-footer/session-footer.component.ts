import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  Input,
} from '@angular/core';
import { Session } from 'src/app/shared/model/session.model';
import { Ticket } from 'src/app/shared/model/ticket.model';
import { UserVote } from 'src/app/shared/model/user-vote.model';
import { AuthService } from 'src/app/core/service/auth.service';
import { ScrumApiService } from 'src/app/core/service/scrum-api.service';
import { VoteOptions } from '../../../../shared/model/vote-options';
import { ChangeDetectorRef } from '@angular/core';
import { JiraApiService } from 'src/app/core/service/jira-api.service';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-session-footer',
  templateUrl: './session-footer.component.html',
  styleUrls: ['./session-footer.component.scss'],
})
export class SessionFooterComponent implements AfterViewChecked {
  @Input() score!: Number;
  @Input() isAdmin!: boolean;
  @Input() session!: Session;
  @Input() currentTicket!: Ticket;
  @Input() votedForThisTicket!: () => boolean;
  @Input() voteOptions!: VoteOptions[];

  vote: UserVote = {
    userAvatar: '',
    userId: '',
    userName: '',
    userVote: '',
  };

  public voted = false;

  constructor(
    private authService: AuthService,
    private scrumApiService: ScrumApiService,
    private changeDetector: ChangeDetectorRef,
    private jiraApiService: JiraApiService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  sendVote(): void {
    const basicProfile = this.authService.getBasicProfile();
    this.session.ticketList.forEach((ticket) => {
      let isOccured = false;
      if (ticket.ticketId === this.currentTicket.ticketId) {
        ticket.userVoteList.forEach((votes) => {
          if (votes.userId === basicProfile.getId()) {
            votes.userVote = this.score + '';
            isOccured = true;
          }
        });
        if (!isOccured) {
          this.vote = {
            userAvatar: basicProfile.getImageUrl(),
            userId: basicProfile.getId(),
            userName: basicProfile.getName(),
            userVote: this.score + '',
          };
          ticket.userVoteList.push(this.vote);
        }
      }
    });
    this.scrumApiService.updateSession(this.session).then();
  }

  giveVote(input: number): void {
    if (!this.session.revealVotes) {
      if (this.session.currentTicketId !== '') {
        if (this.score != input) {
          this.score = input;
          this.voted = true;
          this.sendVote();
        } else {
          this.voted = false;
          this.score = -404;
          this.sendVote();
        }
      }
    } else {
      this.showWarning();
    }
  }

  ngAfterViewChecked() {
    this.changeDetector.detectChanges();
  }

  private showWarning(): void {
    this.translate
      .get(['warnings.change', 'warnings.okay'])
      .subscribe((trans) => {
        this.snackBar.open(trans['warnings.change'], trans['warnings.okay'], {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }


}
