package io.codeshake.scrumpokerbackend.service;

import io.codeshake.scrumpokerbackend.model.JiraIssue;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


@Slf4j
@Service

public class JiraService {

    private final RestTemplate restTemplate;
    private final String baseUrl = "https://api.atlassian.com/ex/jira/";
    private final String apiUrl = "/rest/api/2/";

    public JiraService(RestTemplateBuilder restTemplateBuilder) {
        this.restTemplate = restTemplateBuilder.build();
    }

    public JiraIssue[] getAllIssues(String cloud_id, String access_token, String token_type) {
        String finalUrl = baseUrl + cloud_id + apiUrl;
        ArrayList<JiraIssue> tempJiraIssues = new ArrayList<JiraIssue>();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization",token_type + " " + access_token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity request = new HttpEntity(headers);
        ResponseEntity<String> response = restTemplate.exchange(finalUrl + "search", HttpMethod.GET,request,String.class);
        JSONObject jsonObject = new JSONObject(response.getBody());
        JSONArray issues = (JSONArray) jsonObject.get("issues");
        for(int i = 0; i < issues.length(); i++) {
            JSONObject issue = issues.getJSONObject(i);
            String number = issue.getString("key").replaceAll("[^0-9]", "");
            String code = issue.getString("key").replaceAll("[^A-Za-z]","");
            String name = issue.getJSONObject("fields").getString("summary");
            String description;
            try {
                description = issue.getJSONObject("fields").getString("description");
            } catch (Exception e) {
                description = "";
            }
            String resolution = issue.getJSONObject("fields").getJSONObject("status").getString("name");
            if(resolution.equals("Done")) continue;
            JiraIssue temp = new JiraIssue(number,name,description,code);
            tempJiraIssues.add(temp);
        }
        JiraIssue[] jiraIssues = new JiraIssue[tempJiraIssues.size()];
        jiraIssues = tempJiraIssues.toArray(jiraIssues);
        return jiraIssues;
    }

    public boolean updateStoryPoint(String key, String storyPoint, String cloud_id, String access_token, String token_type) {
        String finalUrl = baseUrl + cloud_id + apiUrl;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization",token_type + " " + access_token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        JSONObject requestBody = new JSONObject();
        JSONObject customFieldStoryPoint = new JSONObject();
        if(storyPoint.equals("")) {
            customFieldStoryPoint.put("customfield_10026", JSONObject.NULL);
        } else {
            customFieldStoryPoint.put("customfield_10026",Integer.parseInt(storyPoint));
        }
        requestBody.put("fields",customFieldStoryPoint);
        HttpEntity<String> request = new HttpEntity<>(requestBody.toString(),headers);
        try {
            restTemplate.put(finalUrl+"issue/"+key,request);
            //ResponseEntity<String> response = restTemplate.exchange(baseUrl + "issue/" + key, HttpMethod.PUT,request,String.class);
            return true;
        } catch (Exception e) {
            System.out.println(e);
            return false;
        }
    }
}
