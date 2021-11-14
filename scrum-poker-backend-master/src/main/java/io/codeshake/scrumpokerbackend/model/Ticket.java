package io.codeshake.scrumpokerbackend.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Ticket {
    @Length(min=4)
    private String ticketName;
    private String ticketId;
    private String ticketDesc;
    private List<UserVote> userVoteList;
    private String ticketScore;
}
