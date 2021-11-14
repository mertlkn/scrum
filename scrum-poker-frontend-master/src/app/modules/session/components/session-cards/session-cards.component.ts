import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ScrumApiService } from 'src/app/core/service/scrum-api.service';
import { Session } from 'src/app/shared/model/session.model';
import { Ticket } from 'src/app/shared/model/ticket.model';
import { UserVote } from 'src/app/shared/model/user-vote.model';

@Component({
  selector: 'app-session-cards',
  templateUrl: './session-cards.component.html',
  styleUrls: ['./session-cards.component.scss'],
})
export class SessionCardsComponent implements OnInit {
  cards: UserVote[] = [];
  @Input() session!: Session;
  @Input() revealVotes!: boolean;
  Number = Number;
  @Input() currentTicket!: Ticket;
  @Input() voteChange!: Subject<Ticket[]>;
  @Input() revealChange!: Subject<boolean>;
  @Input() isAdmin!: boolean;
  private latestTicketId: string = '';

  constructor(
    private scrumApiService: ScrumApiService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.pushCards();
    this.latestTicketId = this.session.currentTicketId
    this.voteChange.subscribe((res: Ticket[]) => {
      console.log('here');
      if(res[0].ticketId !== res[1].ticketId) {
        this.latestTicketId = res[1].ticketId;
        this.pushCards();
      } else {
        this.change(res[0],res[1]);
      }
      console.log(this.cards);
      setTimeout(() => {
        this.stackCards();
      }, 1000);
    });

    this.revealChange.subscribe((res) => {
      console.log('rev', res);
      if (res) {
        console.log(res);
        this.pushCards();
        this.reveal(res);
      } else {
        this.closeEachCard(this.cards.length);
        this.stackCards();
      }
    });
  }

  private stackCards(): void {
    for (let i = 1; i < this.cards.length + 1; i++) {
      var randomRot = -43 + Math.ceil(Math.random() * 6);
      var card = document.querySelector(`.card:nth-child(${i})`);
      if (card === null) {
        continue;
      }
      //@ts-ignore
      card.setAttribute(
        'style',
        `transform: rotateX(60deg) rotateY(0deg) rotateZ(${randomRot}deg) translateZ(${
          i * 10
        }px);`
      );

      if (i == 1) {
        //@ts-ignore
        card.setAttribute(
          'style',
          `transform: rotateX(60deg) rotateY(0deg) rotateZ(${randomRot}deg) translateZ(${
            i * 10
          }px); box-shadow: 12px 12px 0px 12px rgba(0,0,0,0.3);`
        );
      }
    }
  }

  public reveal(res: boolean): void {
    if (res) {
      this.revealVotes = true;
      this.revealEachCard(this.cards.length);
    }
  }

  public revealClick(): void {
    if (!this.session.revealVotes) {
      if (this.isAdmin) {
        this.session.revealVotes = true;
        this.scrumApiService.updateSession(this.session);
      } else {
        this.showWarning();
      }
    }
  }

  private revealEachCard(i: number): void {
    if (i < 1) {
      setTimeout(() => {
        this.turnOverCards();
      }, 1000);
      return;
    }
    setTimeout(() => {
      var card = document.querySelector(`.card:nth-child(${i})`);

      //@ts-ignore
      card.classList.add('open');
      //@ts-ignore
      card.classList.remove('down');
      if (i == 1) {
        //@ts-ignore
        card.setAttribute('style', `box-shadow: 0 10px 24px rgba(0,0,0,0.2);`);
      }
      this.revealEachCard(--i);
    }, 300);
  }

  private closeEachCard(i: number) {
    if (i < 1) {
      return;
    }
    setTimeout(() => {
      var card = document.querySelector(`.card:nth-child(${i})`);
      if (card === null) {
      } else {
        //@ts-ignore
        card.classList.add('down');
        //@ts-ignore
        card.classList.remove('open');
      }
      this.closeEachCard(--i);
    }, 300);
  }

  private turnOverCards(): void {
    for (let i = 1; i < this.cards.length + 1; i++) {
      var card = document.querySelector(`.card:nth-child(${i})`);
      //@ts-ignore
      card.setAttribute(
        'style',
        'transform: scale(0.9) rotateX(0) rotateY(180deg) rotateZ(0) translateY(0) !important'
      );
    }
  }

  private pushCards(): void {
    this.cards = [];
    this.session.ticketList.forEach((ticket) => {
      if (this.latestTicketId === ticket.ticketId) {
        ticket.userVoteList.forEach((vote) => {
          if (vote.userVote !== '-404') {
            console.log('pushing');
            this.cards.push(vote);
          }
        });
      }
    });
  }

  private showWarning(): void {
    this.translate
      .get(['warnings.reveal', 'warnings.okay'])
      .subscribe((trans) => {
        this.snackBar.open(trans['warnings.reveal'], trans['warnings.okay'], {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }

  private change(oldVersion: Ticket, newVersion: Ticket) {
    newVersion.userVoteList.forEach(newVote => {
      let newVoteExists :boolean = false;
      oldVersion.userVoteList.forEach(oldVote => {
        if(newVote.userId === oldVote.userId && oldVote.userVote!=='-404') {
          newVoteExists = true;
        }
      });
      if(newVoteExists) {
        if(newVote.userVote!=='-404') {
          this.cards.forEach(card => {
            if(card.userId === newVote.userId) {
              card.userVote = newVote.userVote;
            }
          })
        } else {
          //delete
          this.cards.forEach(card => {
            if(card.userId === newVote.userId) {
              this.cards.splice(this.cards.indexOf(card),1);
            }
          })
          this.stackCards();
        }
      } else {
        if(newVote.userVote!=='-404') {
          //push
          this.cards.push(newVote);
          this.stackCards();
        } else {

        }
      }
    })
    /*oldVersion.userVoteList.forEach(oldVote => {
      let voteExists: boolean = false;
      newVersion.userVoteList.forEach(newVote => {
        if(oldVote.userId === newVote.userId) {  
          voteExists = true;
          if(oldVote.userVote='-404') {
            voteExists = false;
          }
          if(newVote.userVote !== '-404') {
            if(oldVote.userVote !== newVote.userVote) {
              this.cards.forEach(card => {
                if(card.userId === oldVote.userId) {
                  card.userVote = newVote.userVote;
                }
              })
            }
          } else {
            this.cards.forEach(card => {
              if(card.userId === oldVote.userId) {
                console.log("deleted index",this.cards.indexOf(card));
                this.cards.splice(this.cards.indexOf(card),1);
              }
            })
          }
        }
        if(!voteExists) {
          this.cards.push(newVote);
        }
      })
      this.stackCards();
    })*/
  }
}