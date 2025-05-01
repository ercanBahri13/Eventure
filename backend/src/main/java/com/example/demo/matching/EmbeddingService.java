package com.example.demo.matching;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.*;

@Service
public class EmbeddingService {

    private final ObjectMapper mapper = new ObjectMapper();

    public float[] getEmbedding(String input) {
        try {
            ProcessBuilder pb = new ProcessBuilder("python3", "src/main/python/embed.py");
            Process process = pb.start();

            // Write input to Python
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()))) {
                writer.write(input);
                writer.flush();
            }

            // Read output from Python
            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line);
                }
            }

            return mapper.readValue(output.toString(), float[].class);

        } catch (Exception e) {
            System.err.println("Failed to get embedding: " + e.getMessage());
            return new float[0]; // or throw custom RuntimeException
        }
    }
}
