package com.example.demo.controllers;

import com.example.demo.entities.Event;
import com.example.demo.dto.EventResponse;
import com.example.demo.services.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.example.demo.dto.CreateEventRequest;

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

    /*@GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) throws Exception {
        return eventService.getEventById(id);
    }*/
    @GetMapping("/{id}")
    public EventResponse getEventById(@PathVariable Long id) throws Exception {
        Event e = eventService.getEventById(id);

        EventResponse r = new EventResponse();
        r.id = e.getId();
        r.name = e.getName();
        r.type = e.getType();
        r.creatorUsername = e.getCreatorUsername();
        r.creatorId = e.getCreator() != null ? e.getCreator().getId() : null;
        r.date = e.getDate();
        r.startTime = e.getStartTime();
        r.endTime = e.getEndTime();
        r.city = e.getCity();
        r.location = e.getLocation();
        r.capacity = e.getCapacity();
        r.imageUrl = e.getImageUrl();
        r.latitude = e.getLatitude();
        r.longitude = e.getLongitude();
        return r;
    }


    @PostMapping("/create")
    public Event createEventUser(@RequestBody CreateEventRequest request) throws Exception {
        return eventService.createEventUser(request);
    }
    // Additional endpoints if needed...
}
