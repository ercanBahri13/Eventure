// backend/src/main/java/com/example/demo/services/SafetyAlertService.java
package com.example.demo.services;

import com.example.demo.dto.SafetyAlertRequest;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class SafetyAlertService {
    @Autowired private JavaMailSender mailSender;
    @Autowired private UserRepository  userRepo;

    @Value("${alert.recipients}")
    private String recipients; // e.g. "alice@example.com,bob@example.com"

    public void processAlert(SafetyAlertRequest req) throws Exception {
        User u = userRepo.findById(req.userId)
                .orElseThrow(() -> new Exception("User not found"));

        String googleMaps = (req.latitude != null && req.longitude != null)
                ? "https://maps.google.com/?q=" + req.latitude + "," + req.longitude
                : "Location unavailable";

        String subject = u.getUsername() + " pressed the SAFETY button!";
        String text = u.getUsername() + " pressed the safety button – CHECK IT NOW!\n\n"
                + "Phone: " + u.getPhoneNumber() + "\n"
                + "Location: " + googleMaps;

        // Build the message
        SimpleMailMessage msg = new SimpleMailMessage();
        String[] toAddresses = recipients.split("\\s*,\\s*");
        msg.setTo(toAddresses);
        msg.setSubject(subject);
        msg.setText(text);

        // Send in a background thread so this HTTP handler never blocks
        new Thread(() -> {
            try {
                System.out.println("🔴 [SafetyAlertService] Sending email in background…");
                mailSender.send(msg);
                System.out.println("✅ [SafetyAlertService] Email sent");
            } catch (Exception e) {
                System.err.println("⚠️ [SafetyAlertService] Failed to send email:");
                e.printStackTrace();
            }
        }).start();
    }
}
