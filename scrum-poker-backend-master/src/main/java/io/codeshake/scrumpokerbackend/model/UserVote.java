package io.codeshake.scrumpokerbackend.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserVote {
    private String ticketId;
    private String userId;
    private String userAvatar;
    private String userName;
    private String userVote;
}
