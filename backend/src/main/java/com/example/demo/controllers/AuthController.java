package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Allow requests from React Native dev server
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            User loggedInUser = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(loggedInUser);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody User userRequest) {
        // userRequest will have an 'email' field
        try {
            userService.generateResetToken(userRequest.getEmail());
            return ResponseEntity.ok("Reset password instructions sent (simulated). Check console for token.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        // We'll create a small DTO class for clarity
        try {
            userService.resetPassword(request.getResetToken(), request.getNewPassword());
            return ResponseEntity.ok("Password successfully updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/save-event")
    public ResponseEntity<?> saveEvent(@RequestBody SaveRegisterRequest request) {
        try {
            userService.saveEventForUser(request.getUserId(), request.getEventId());
            return ResponseEntity.ok("Event saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register-event")
    public ResponseEntity<?> registerEvent(@RequestBody SaveRegisterRequest request) {
        try {
            userService.registerEventForUser(request.getUserId(), request.getEventId());
            return ResponseEntity.ok("Event registered successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Create a small inner static class or a separate file
    public static class ResetPasswordRequest {
        private String resetToken;
        private String newPassword;

        public String getResetToken() {
            return resetToken;
        }
        public void setResetToken(String resetToken) {
            this.resetToken = resetToken;
        }
        public String getNewPassword() {
            return newPassword;
        }
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
    public static class SaveRegisterRequest {
        private Long userId;
        private Long eventId;

        public Long getUserId() {
            return userId;
        }
        public void setUserId(Long userId) {
            this.userId = userId;
        }
        public Long getEventId() {
            return eventId;
        }
        public void setEventId(Long eventId) {
            this.eventId = eventId;
        }
    }
}
