import {UserVote} from './user-vote.model';

export interface CloudMessage extends UserVote {
  ticketId: string;
  firebaseTopic: string;
  sessionId: string;
}
