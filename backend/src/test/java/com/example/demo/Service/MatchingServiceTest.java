package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.entities.Event;
import com.example.demo.matching.MatchingService;
import com.example.demo.matching.EmbeddingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;

public class MatchingServiceTest {

    @Mock
    private EmbeddingService embeddingService;

    @InjectMocks
    private MatchingService matchingService;

    private User user;
    private Event event1;
    private Event event2;
    private Event event3;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);

        // Create user with specific interests
        user = new User();
        user.setId(1L);
        user.setInterests(Arrays.asList("Music", "Festival"));

        // Create multiple events with different tags
        event1 = new Event();
        event1.setId(1L);
        event1.setTags(Arrays.asList("Music", "Festival"));

        event2 = new Event();
        event2.setId(2L);
        event2.setTags(Arrays.asList("Technology", "Conference"));

        event3 = new Event();
        event3.setId(3L);
        event3.setTags(Arrays.asList("Art", "Gallery"));

        // Mock the embedding service to return predefined embeddings for the events and user
        when(embeddingService.getEmbedding("Music, Festival")).thenReturn(new float[]{0.8f, 0.2f});
        when(embeddingService.getEmbedding("Music, Festival")).thenReturn(new float[]{0.8f, 0.2f});
        when(embeddingService.getEmbedding("Technology, Conference")).thenReturn(new float[]{0.1f, 0.9f});
        when(embeddingService.getEmbedding("Art, Gallery")).thenReturn(new float[]{0.2f, 0.7f});

        // Initialize matchingService with the mocked embedding service
        matchingService = new MatchingService(embeddingService);

        // Preload event embeddings
        matchingService.getEventEmbedding(event1);
        matchingService.getEventEmbedding(event2);
        matchingService.getEventEmbedding(event3);
        matchingService.getUserEmbedding(user);
    }

    @Test
    public void testMatchingServiceReturnsCorrectEvent() {
        // Test matching logic
        long matchedEventId = matchingService.findBestMatchingEvent(user);

        // Assert that the best matching event is event1 based on the user interests
        assertEquals(1L, matchedEventId, "The best matching event should be event1");
    }
}
