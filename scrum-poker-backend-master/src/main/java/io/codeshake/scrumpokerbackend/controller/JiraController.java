package io.codeshake.scrumpokerbackend.controller;
import io.codeshake.scrumpokerbackend.model.JiraIssue;
import io.codeshake.scrumpokerbackend.service.FirebaseService;
import io.codeshake.scrumpokerbackend.service.JiraService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200",maxAge = 3600)
@RestController
@AllArgsConstructor
@RequestMapping("/jira")
public class JiraController {
    private final JiraService jiraService;

    @GetMapping("/get")
    private JiraIssue[] getAllIssues(@RequestParam("cloudId") String cloudId, @RequestHeader("access_token") String access_token, @RequestHeader("token_type") String token_type) {
        return jiraService.getAllIssues(cloudId,access_token,token_type);
    }

    @PutMapping("/vote/{key}")
    private boolean updateStoryPoint(@PathVariable String key, @RequestHeader("storyPoint") String storyPoint, @RequestHeader("access_token") String access_token, @RequestHeader("token_type") String token_type, @RequestParam("cloudId") String cloudId) {
        return jiraService.updateStoryPoint(key,storyPoint,cloudId,access_token,token_type);
    }
}
