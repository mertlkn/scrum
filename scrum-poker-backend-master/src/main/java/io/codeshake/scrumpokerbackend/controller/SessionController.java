package io.codeshake.scrumpokerbackend.controller;

import io.codeshake.scrumpokerbackend.model.SessionDTO;
import io.codeshake.scrumpokerbackend.model.TicketDTO;
import io.codeshake.scrumpokerbackend.model.Session;
import io.codeshake.scrumpokerbackend.service.SessionService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@AllArgsConstructor
@RequestMapping("/session")
public class SessionController {

    private SessionService sessionService;

    @PostMapping("/")
    private Session createSession(@RequestBody SessionDTO sessionDTO) {
        return sessionService.createSession(sessionDTO);
    }

    @GetMapping("/{sessionId}")
    private SessionDTO getSession(@PathVariable String sessionId, @RequestHeader String authorization) throws ExecutionException, InterruptedException {
       return sessionService.getSession(sessionId,authorization);
    }

    @PostMapping("/update")
    private void updateSession(@RequestBody SessionDTO sessionDTO, @RequestHeader String authorization) throws ExecutionException, InterruptedException {
        sessionService.updateSession(sessionDTO, authorization);
    }

    @GetMapping("/check/{sessionId}")
    private boolean isAdmin(@PathVariable String sessionId,@RequestHeader String authorization) throws ExecutionException, InterruptedException {
        return sessionService.isAdmin(sessionId,authorization);
    }

    @PostMapping("/vote/{sessionId}")
    private void setFinalVote(@RequestBody TicketDTO ticketDTO, @PathVariable String sessionId, @RequestHeader String authorization) throws ExecutionException, InterruptedException {
        sessionService.setFinalVote(ticketDTO, sessionId, authorization);
    }
}
