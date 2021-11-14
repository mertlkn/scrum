package io.codeshake.scrumpokerbackend.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CloudMessage extends UserVote {
	private String sessionId;
	private String ticketId;
	private String firebaseTopic;
}
