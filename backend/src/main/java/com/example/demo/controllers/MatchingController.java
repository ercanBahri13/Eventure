package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.entities.Event;
import com.example.demo.matching.MatchingService;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/match")
public class MatchingController {

    private final MatchingService matchingService;
    private final UserService userService;

    @Autowired
    public MatchingController(MatchingService matchingService, UserService userService) {
        this.matchingService = matchingService;
        this.userService = userService;
    }

    // POST endpoint to match a user with the best event based on interests/tags
    @PostMapping("/user")
    public ResponseEntity<Long> matchUser(@RequestBody User user) {
        try {
            // Ensure the user embedding is created
            matchingService.getUserEmbedding(user);

            // Find the best matching event for the user
            long bestEventId = matchingService.findBestMatchingEvent(user);

            // Return the event ID that is the best match
            return ResponseEntity.ok(bestEventId);
        } catch (Exception e) {
            // Handle any exceptions (like no matching events or missing embeddings)
            return ResponseEntity.status(500).body(null);
        }
    }

    // POST endpoint to create embeddings for an event (for example, after creation or update)
    @PostMapping("/event")
    public ResponseEntity<Long> matchEvent(@RequestBody Event event) {
        try {
            // Generate the event embedding
            matchingService.generateEventEmbeddings(event);

            // You might also want to return the event ID here, for confirmation or debug
            return ResponseEntity.ok(event.getId());
        } catch (Exception e) {
            // Handle any exception in generating embeddings or matching
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Long>> getMatchingEventIds(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0.7") double threshold
    ) {
        try {
            User user = userService.getUserProfile(userId);
            List<Long> matches = matchingService.findMatchingEvents(user, threshold);
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
   }
}