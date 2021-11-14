package io.codeshake.scrumpokerbackend.model;

import java.util.List;

import io.codeshake.scrumpokerbackend.model.UserVote;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TicketDTO {
    private String ticketName;
    private String ticketId;
    private String ticketDesc;
    private List<UserVote> userVoteList;
    private String ticketScore;
}
