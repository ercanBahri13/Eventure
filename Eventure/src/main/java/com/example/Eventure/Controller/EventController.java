package com.example.Eventure.Controller;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.tools.JavaFileObject;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.ReflectionUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Eventure.EventRepository;
import com.example.Eventure.Models.*;

@RestController
@RequestMapping("/api")
public class EventController {
    @Autowired
    private EventRepository eventRepository;

    @Autowired
    public EventController(){
        this.eventRepository = eventRepository;
    }
    @GetMapping("/events")
    public List<Event> getEvents() {
        // Fetch events from the database
        return eventRepository.findAll();
    }

    @PostMapping("/events")
    public Event addEvent(@RequestBody Event event) {
        // Save a new event to the database
        event.setDescription(event.getDescription());
        return eventRepository.save(event);
    }
    @PatchMapping("/events/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody JsonObject updateData) {
        // Fetch the existing event from the database
        Event existingEvent = eventRepository.findById(id).orElseThrow(()-> new RuntimeException("Event not found"));;
        // Iterate through the fields in the JSON object and update them dynamically
        updateEventFields(existingEvent, updateData);

        // Save the updated event back to the database
        return eventRepository.save(existingEvent);
    }

    private void updateEventFields(Event event, JsonObject updateData) {
        // Iterate through the fields in the JSON object
        for (Map.Entry<String, com.google.gson.JsonElement> entry : updateData.entrySet()) {
            String fieldName = entry.getKey();
            com.google.gson.JsonElement value = entry.getValue();

            // Split field name to check for nested fields (e.g., "location.latitude")
            String[] fieldParts = fieldName.split("\\.");
            System.out.println(fieldParts.length + " !!!!!!");
            if (fieldParts.length == 1) {
                // Non-nested field (e.g., "name", "description", "date")
                setFieldValue(event, fieldParts[0], value);
            } else if (fieldParts.length == 2 && "location".equals(fieldParts[0])) {
                // Nested field (e.g., "location.latitude")
                System.out.println("happy");
                updateLocationField(event, fieldName, value);
            }
        }
    }

    // Set value for non-nested fields
    private void setFieldValue(Event event, String fieldName, com.google.gson.JsonElement value) {
        try {
            Field field = Event.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            if (field.getType() == String.class) {
                field.set(event, value.getAsString());
            } else if (field.getType() == java.sql.Date.class) {
                field.set(event, java.sql.Date.valueOf(value.getAsString()));  // Assuming format is YYYY-MM-DD
            }
            // Add more type checks if needed (e.g., Integer, Double, etc.)
        } catch (NoSuchFieldException | IllegalAccessException e) {
            e.printStackTrace();
        }
    }

    // Set value for nested fields like "location.latitude"
    private void updateLocationField(Event event, String field, Object value) {
        Location location = event.getLocation();
        switch (field) {
            case "latitude":
                location.setLatitude((Double) value);
                break;
            case "longitude":
                location.setLongitude((Double) value);
                break;
            case "address":
                location.setAddress((String) value);
                break;
            case "city":
                location.setCity((String) value);
                break;
            case "district":
                location.setDistrict((String) value);
                break;
            default:
                // Handle unrecognized fields
                break;
        }
}
}
