package io.codeshake.scrumpokerbackend.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.google.gson.Gson;
import io.codeshake.scrumpokerbackend.model.SessionDTO;
import io.codeshake.scrumpokerbackend.model.TicketDTO;
import io.codeshake.scrumpokerbackend.mapper.SessionMapper;
import io.codeshake.scrumpokerbackend.mapper.TicketMapper;
import io.codeshake.scrumpokerbackend.model.Payload;
import io.codeshake.scrumpokerbackend.model.Session;
import io.codeshake.scrumpokerbackend.model.Ticket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Slf4j
@RequiredArgsConstructor
public class SessionService {

    private final SessionMapper sessionMapper;
    private final TicketMapper ticketMapper;

    public Session createSession(SessionDTO sessionDTO) {
        Session session = sessionMapper.mapToSession(sessionDTO);
        Firestore firestore = FirestoreClient.getFirestore();
        String uniqueId = firestore.collection("sessions").document().getId();
        session.setSessionId(uniqueId);
        firestore.collection("sessions").document(uniqueId).set(session);
        return session;
    }

    public Payload getPayload(String authorization) {
        String[] chunks = authorization.split("\\.");
        Base64.Decoder decoder = Base64.getDecoder();
        String content = new String(decoder.decode(chunks[1]));
        Gson gson = new Gson();
        Payload payload = gson.fromJson(content, Payload.class);
        return payload;
    }

    public boolean isAdmin(String sessionId, String authorization) throws ExecutionException, InterruptedException {
        Payload payload = getPayload(authorization);
        Firestore firestore = FirestoreClient.getFirestore();
        ApiFuture<DocumentSnapshot> documentSnapshotApiFuture = firestore.collection("sessions").document(sessionId).get();
        Session session = documentSnapshotApiFuture.get().toObject(Session.class);
        return session.getAdminId().equals(payload.getSub());
    }

    public SessionDTO getSession(String sessionId,String authorization) throws ExecutionException, InterruptedException {
        Payload payload = getPayload(authorization);
        Firestore firestore = FirestoreClient.getFirestore();
        ApiFuture<DocumentSnapshot> documentSnapshotApiFuture = firestore.collection("sessions").document(sessionId).get();
        Session session = documentSnapshotApiFuture.get().toObject(Session.class);
        if (!isAdmin(sessionId, authorization)) {
            if (!session.isRevealVotes()) {
                session.getTicketList().forEach(ticket -> {
                    ticket.getUserVoteList().forEach(vote -> {
                        if(!payload.getSub().equals(vote.getUserId()))
                        if (!vote.getUserVote().equals("-404"))
                            vote.setUserVote("-403");
                    });
                });
            }
        }
        SessionDTO sessionDTO = sessionMapper.mapToSessionDTO(session);
        return sessionDTO;


    }

    public void updateSession (SessionDTO sessionDTO, String authorization) throws ExecutionException, InterruptedException {
        Session session = sessionMapper.mapToSession(sessionDTO);
        Firestore firestore = FirestoreClient.getFirestore();
        Payload payload = getPayload(authorization);
        if (isAdmin(session.getSessionId(),authorization)) {
            firestore.collection("sessions").document(session.getSessionId()).set(session);
        } else {
            DocumentReference ref=firestore.collection("sessions").document(session.getSessionId());
            Session oldSession = ref.get().get().toObject(Session.class);
            AtomicBoolean existed= new AtomicBoolean(false);
            oldSession.getTicketList().forEach(ticket -> {
                if(ticket.getTicketId().equals(session.getCurrentTicketId())) {
                    ticket.getUserVoteList().forEach(vote -> {
                        if(vote.getUserId().equals(payload.getSub())) {
                            existed.set(true);
                            session.getTicketList().forEach(ticket2 -> {
                                if(ticket2.getTicketId().equals(session.getCurrentTicketId())) {
                                    ticket2.getUserVoteList().forEach(vote2 -> {
                                        if (vote2.getUserId().equals(payload.getSub())) {
                                            vote.setUserVote(vote2.getUserVote());
                                        }
                                    });
                                }
                            });
                        }
                    });
                    if(!existed.get()) {
                        session.getTicketList().forEach(ticket2 -> {
                            if(ticket2.getTicketId().equals(session.getCurrentTicketId())) {
                                ticket2.getUserVoteList().forEach(vote2 -> {
                                    if (vote2.getUserId().equals(payload.getSub())) {
                                        ticket.getUserVoteList().add(vote2);
                                    }
                                });
                            }
                        });
                    }
                }
            });
            oldSession.setActiveUsers(session.getActiveUsers());
            firestore.collection("sessions").document(oldSession.getSessionId()).set(oldSession);
        }
        /*DocumentReference ref=firestore.collection("sessions").document(session.getSessionId());
        if(isAdmin(session.getSessionId(),authorization)) {
            Session oldSession = ref.get().get().toObject(Session.class);
            if(oldSession.isRevealVotes()!=session.isRevealVotes()) {
                ref.update("revealVotes",session.isRevealVotes());
                return;
            }
            else if(!oldSession.getCurrentTicketId().equals(session.getCurrentTicketId())){
                ref.update("currentTicketId",session.getCurrentTicketId());
                return;
            }
        }
        String voterId=payload.getSub();
        String newVote[]= new String[] {"-99"};
        session.getTicketList().forEach(ticket -> {
            if(ticket.getTicketId().equals(session.getCurrentTicketId())) {
                ticket.getUserVoteList().forEach(vote -> {
                    if(vote.getUserId().equals(voterId)) {
                        newVote[0]=vote.getUserVote();
                    }
                });
            }
        });
        List<Ticket> oldTicketList= ref.get().get().toObject(Session.class).getTicketList();
        oldTicketList.forEach(ticket -> {
            if(ticket.getTicketId().equals(session.getCurrentTicketId())) {
                ticket.getUserVoteList().forEach(vote -> {
                    if(vote.getUserId().equals(voterId)) {
                        vote.setUserVote(newVote[0]);;
                    }
                });
            }
        });
        session.setTicketList(oldTicketList);
        ref.set(session);*/

    }

    public void setFinalVote (TicketDTO ticketDTO, String sessionId, String authorization) throws ExecutionException, InterruptedException {
        Ticket ticket = ticketMapper.mapToTicket(ticketDTO);
        if (isAdmin(sessionId,authorization)) {
        Firestore firestore = FirestoreClient.getFirestore();
        ApiFuture<DocumentSnapshot> documentSnapshotApiFuture = firestore.collection("sessions").document(sessionId).get();
        Session session = documentSnapshotApiFuture.get().toObject(Session.class);
        List<Ticket> ticketList = session.getTicketList();
       if (ticketList.isEmpty()) {
           ticketList = new ArrayList<>();
           ticketList.add(ticket);
       } else {
           ticketList.stream().forEach(t -> {
               if (t.getTicketId().equals(ticket.getTicketId())) {
                   t.setTicketScore(ticket.getTicketScore());
               }
           });
       }
        firestore.collection("sessions").document(sessionId).set(session);
        }
    }
}
