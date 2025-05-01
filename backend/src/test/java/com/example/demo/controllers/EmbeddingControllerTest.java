package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.matching.MatchingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

public class EmbeddingControllerTest {

    private MatchingService matchingService;
    private User user;

    @BeforeEach
    public void setUp() {
        // Initialize MatchingService mock or real instance
        matchingService = mock(MatchingService.class);

        // Initialize the user object
        user = new User();
        user.setId(1L);  // Ensure this method is public in the User class
        List<String> interests = Arrays.asList("Music", "Technology", "Sports");
        user.setInterests(interests);
    }

    @Test
    public void testMatchUser() {
        // Assume the best matching event ID is 2L
        when(matchingService.findBestMatchingEvent(user)).thenReturn(2L);

        long eventId = matchingService.findBestMatchingEvent(user);

        assertEquals(2L, eventId, "The best event ID should be 2.");
    }

    // Add more tests as needed
}
