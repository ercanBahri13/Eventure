package com.example.demo.controllers;

import com.example.demo.entities.Event;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public List<Event> getEvents(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return eventService.searchEventsByName(search);
        } else {
            return eventService.getAllEvents();
        }
    }

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        System.out.println("Event received: " + event); // Debug log
        return eventService.createEvent(event);
    }

    // Additional endpoints if needed...
}