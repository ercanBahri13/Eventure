package com.example.demo.matching;

import com.example.demo.entities.User;
import com.example.demo.entities.Event;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;

@Service
public class MatchingService {

    private final EmbeddingService embeddingService;
    private final Map<Long, float[]> userEmbeddings = new HashMap<>();
    private final Map<Long, float[]> eventEmbeddings = new HashMap<>();

    @Autowired
    public MatchingService(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    // For embedding the interests of a User
    public float[] getUserEmbedding(User user) {
        String userInterests = String.join(", ", user.getInterests());
        float[] embedding = embeddingService.getEmbedding(userInterests);
        userEmbeddings.put(user.getId(), embedding);  // Storing the embedding for later use
        return embedding;
    }

    // For embedding the tags of an Event
    public float[] getEventEmbedding(Event event) {
        String eventTags = String.join(", ", event.getTags());
        float[] embedding = embeddingService.getEmbedding(eventTags);
        eventEmbeddings.put(event.getId(), embedding);  // Storing the embedding for later use
        return embedding;
    }

    // Generate embeddings for all events (perhaps after saving or updating them)
    public void generateEventEmbeddings(Event event) {
        getEventEmbedding(event);
    }

    // Matching User to Event based on cosine similarity
    public long findBestMatchingEvent(User user) {
        float[] userEmbedding = userEmbeddings.get(user.getId());
        if (userEmbedding == null) {
            throw new IllegalArgumentException("User embedding not found");
        }

        long bestEventId = -1;
        double maxSimilarity = -1.0;

        // Compare the user embedding with each event's embedding using cosine similarity
        for (Map.Entry<Long, float[]> entry : eventEmbeddings.entrySet()) {
            long eventId = entry.getKey();
            float[] eventEmbedding = entry.getValue();
            double similarity = cosineSimilarity(userEmbedding, eventEmbedding);

            if (similarity > maxSimilarity) {
                maxSimilarity = similarity;
                bestEventId = eventId;
            }
        }

        if (bestEventId == -1) {
            throw new IllegalStateException("No matching event found");
        }

        return bestEventId;
    }

    // Cosine similarity function to compare two vectors
    private double cosineSimilarity(float[] vec1, float[] vec2) {
        if (vec1.length != vec2.length) {
            throw new IllegalArgumentException("Vectors must have the same length");
        }

        double dotProduct = 0.0;
        double magnitudeVec1 = 0.0;
        double magnitudeVec2 = 0.0;

        for (int i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            magnitudeVec1 += Math.pow(vec1[i], 2);
            magnitudeVec2 += Math.pow(vec2[i], 2);
        }

        if (magnitudeVec1 == 0.0 || magnitudeVec2 == 0.0) {
            return 0.0;  // Return 0 if either of the vectors has zero magnitude (edge case)
        }

        return dotProduct / (Math.sqrt(magnitudeVec1) * Math.sqrt(magnitudeVec2));
    }
}
