package io.codeshake.scrumpokerbackend.model;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Session {
    private String sessionId;
    private String adminId;
    @NotBlank
    private String sessionName;
    private String currentTicketId;
    private boolean revealVotes;
    @NotEmpty
    private List<Ticket> ticketList;
    private String issueCode;
    private String cloudId;
    private int voteType;
    private List<ActiveUser> activeUsers;
}
