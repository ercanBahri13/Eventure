package com.example.demo.controllers;

import com.example.demo.matching.EmbeddingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/embedding")
public class EmbeddingController {

    @Autowired
    private EmbeddingService embeddingService;

    @PostMapping
    public float[] getEmbedding(@RequestBody String inputText) throws IOException {
        return embeddingService.getEmbedding(inputText);
    }
}
