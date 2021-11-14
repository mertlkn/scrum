package io.codeshake.scrumpokerbackend.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.TopicManagementResponse;
import io.codeshake.scrumpokerbackend.model.CloudMessage;
import io.codeshake.scrumpokerbackend.model.FirebaseTopic;
import io.codeshake.scrumpokerbackend.model.UserVote;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class FirebaseService {

   public void subscribeToTopic(FirebaseTopic firebaseTopic) throws FirebaseMessagingException {
       List<String> tokens = Collections.singletonList(firebaseTopic.getToken());
       FirebaseMessaging.getInstance().subscribeToTopic(tokens, firebaseTopic.getTopic());
    }

    public void send(CloudMessage cloudMessage) throws FirebaseMessagingException {
        Message message = Message.builder()
                .putData("userId", cloudMessage.getUserId())
                .putData("userAvatar", cloudMessage.getUserAvatar())
                .putData("userName", cloudMessage.getUserName())
                .putData("userVote", cloudMessage.getUserVote())
                .putData("ticketId", cloudMessage.getTicketId())
                .setTopic(cloudMessage.getFirebaseTopic())
                .build();
        String response = FirebaseMessaging.getInstance().send(message); //todo db
    }

    public void unsubscribeToTopic(FirebaseTopic firebaseTopic) throws FirebaseMessagingException {
        List<String> tokens = Collections.singletonList(firebaseTopic.getToken());
        FirebaseMessaging.getInstance().unsubscribeFromTopic(tokens, firebaseTopic.getTopic());
    }
}
