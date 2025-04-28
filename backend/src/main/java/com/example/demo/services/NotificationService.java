// backend/src/main/java/com/example/demo/services/NotificationService.java
package com.example.demo.services;

import com.example.demo.entities.Notification;
import com.example.demo.entities.User;
import com.example.demo.repositories.NotificationRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired NotificationRepository notifRepo;
    @Autowired UserRepository userRepo;

    public void mentionNotify(Long mentionedUserId, Long commenterId, Long eventId) throws Exception {
        User mentioned = userRepo.findById(mentionedUserId)
                .orElseThrow(() -> new Exception("Mentioned user not found"));
        User commenter = userRepo.findById(commenterId)
                .orElseThrow(() -> new Exception("Commenter not found"));

        String msg = "@" + commenter.getUsername() +
                " mentioned you in a comment on event #" + eventId;
        Notification n = new Notification();
        n.setRecipient(mentioned);
        n.setMessage(msg);
        notifRepo.save(n);
    }

    public List<Notification> getUnread(Long userId) throws Exception {
        User u = userRepo.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        return notifRepo.findByRecipientAndReadFalse(u);
    }

    public void markRead(Long notifId) {
        notifRepo.findById(notifId).ifPresent(n -> {
            n.setRead(true);
            notifRepo.save(n);
        });
    }
}
