package io.codeshake.scrumpokerbackend.model;

import java.util.List;
import io.codeshake.scrumpokerbackend.model.Ticket;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SessionDTO {
    private String sessionId;
    private String adminId;
    private String sessionName;
    private String currentTicketId;
    private boolean revealVotes;
    private List<Ticket> ticketList;
    private String issueCode;
    private String cloudId;
    private int voteType;
    private List<ActiveUser> activeUsers;
}
