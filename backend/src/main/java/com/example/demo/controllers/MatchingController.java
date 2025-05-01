package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.entities.Event;
import com.example.demo.matching.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/match")
public class MatchingController {

    private final MatchingService matchingService;

    @Autowired
    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
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

    // Optionally, you can add more endpoints for more complex scenarios (e.g., batch matching)
}
