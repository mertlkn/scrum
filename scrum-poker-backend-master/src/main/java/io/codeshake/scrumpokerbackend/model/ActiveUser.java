package io.codeshake.scrumpokerbackend.model;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ActiveUser {
    private String userId;
    private String userAvatar;
    private String userName;
}
