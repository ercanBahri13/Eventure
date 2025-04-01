package com.example.demo.services;

import com.example.demo.entities.Event;
import com.example.demo.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import com.example.demo.repositories.UserRepository;
import com.example.demo.entities.User; // or wherever your User entity is
import org.springframework.beans.factory.annotation.Autowired;
import java.time.LocalDate;
import java.time.LocalTime;
import com.example.demo.dto.CreateEventRequest;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<Event> searchEventsByName(String name) {
        return eventRepository.findByNameContainingIgnoreCase(name);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event getEventById(Long id) throws Exception {
        return eventRepository.findById(id)
                .orElseThrow(() -> new Exception("Event not found with ID: " + id));
    }

    public Event createEventUser(CreateEventRequest req) throws Exception {
        // 1) Find the user
        User creator = userRepository.findById(req.userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + req.userId));

        // 2) Build the event
        Event event = new Event();
        event.setName(req.name);
        event.setType(req.type);
        event.setCity(req.city);
        event.setLocation(req.location);
        event.setCapacity(req.capacity);
        event.setImageUrl(req.imageUrl);
        // parse date/time if needed
        event.setDate(LocalDate.parse(req.date));
        event.setStartTime(LocalTime.parse(req.startTime));
        event.setEndTime(LocalTime.parse(req.endTime));

        // 3) Link the creator
        event.setCreator(creator);

        // 4) Save
        return eventRepository.save(event);
    }

    // Optionally: get single event, update event, etc.
}
