package io.codeshake.scrumpokerbackend.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class JiraIssue {
    private String issueNumber;
    private String issueName;
    private String issueDescription;
    private String issueCode;
}
