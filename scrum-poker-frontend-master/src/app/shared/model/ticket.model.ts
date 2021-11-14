import {UserVote} from './user-vote.model';

export interface Ticket {
  ticketName: string;
  ticketId: string;
  ticketDesc: string;
  userVoteList: UserVote[]; //TODO votes should be null when creating session
  ticketScore: string;
}
