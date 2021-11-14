package io.codeshake.scrumpokerbackend.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import io.codeshake.scrumpokerbackend.model.CloudMessage;
import io.codeshake.scrumpokerbackend.model.FirebaseTopic;
import io.codeshake.scrumpokerbackend.model.UserVote;
import io.codeshake.scrumpokerbackend.service.FirebaseService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@AllArgsConstructor
@RequestMapping("/firebase")
public class FirebaseController {
    private final FirebaseService firebaseService;

    @PostMapping("/subscribe")
    private void subscribeToTopic(@RequestBody FirebaseTopic firebaseTopic) throws FirebaseMessagingException {
        firebaseService.subscribeToTopic(firebaseTopic);
    }

    @PostMapping("/")
    private void sendMessage(@RequestBody CloudMessage cloudMessage) throws FirebaseMessagingException {
        firebaseService.send(cloudMessage);
    }

    @PostMapping("/unsubscribe")
    private void unsubscribeToTopic(@RequestBody FirebaseTopic firebaseTopic) throws FirebaseMessagingException {
        firebaseService.unsubscribeToTopic(firebaseTopic);
    }
}
