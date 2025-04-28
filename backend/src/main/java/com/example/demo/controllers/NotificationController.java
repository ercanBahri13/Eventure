// backend/src/main/java/com/example/demo/controllers/NotificationController.java
package com.example.demo.controllers;

import com.example.demo.entities.Notification;
import com.example.demo.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins="*")
public class NotificationController {
    @Autowired private NotificationService svc;

    @GetMapping("/{userId}")
    public List<Notification> get(@PathVariable Long userId) throws Exception {
        return svc.getUnread(userId);
    }

    @PostMapping("/{notifId}/read")
    public void markRead(@PathVariable Long notifId) {
        svc.markRead(notifId);
    }
}
