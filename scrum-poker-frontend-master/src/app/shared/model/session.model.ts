import { ActiveUser } from './active-user.model';
import {Ticket} from './ticket.model';

export interface Session {
  sessionId: string;
  adminId: string;
  sessionName: string;
  currentTicketId: string;
  revealVotes: boolean;
  ticketList: Ticket[];
  issueCode: string;
  cloudId: string;
  voteType: number;
  activeUsers: ActiveUser[];
}
