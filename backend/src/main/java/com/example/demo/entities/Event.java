package com.example.demo.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "events")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;             // e.g. "Music Festival"
    private String type;             // e.g. "Concert", "Conference", "Meetup"
    private String creatorUsername;  // user who created this event
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String city;
    private String location;         // more specific address or location name
    private int capacity;            // maximum number of participants
    private String imageUrl;         // store an image link for demonstration
    private double latitude;
    private double longitude;

    // We'll store participant usernames as a comma-separated string for simplicity
    @JsonIgnore
    private String participantUsers;

    // Additional columns if needed (e.g. description, price, etc.)

    public Event() {}

    public Event(String name, String type, String creatorUsername,
                 LocalDate date, LocalTime startTime, LocalTime endTime,
                 String city, String location, int capacity, String imageUrl, double latitude, double longitude) {
        this.name = name;
        this.type = type;
        this.creatorUsername = creatorUsername;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.city = city;
        this.location = location;
        this.capacity = capacity;
        this.imageUrl = imageUrl;
        this.longitude = longitude;
        this.latitude = latitude;
    }

    @ManyToOne
    @JoinColumn(name = "creator_id") // foreign key in events table
    @JsonBackReference
    private User creator;

    // getters and setters...
    // e.g. getId(), setId(), getName(), setName(), etc.
    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCreatorUsername() {
        return creatorUsername;
    }

    public void setCreatorUsername(String creatorUsername) {
        this.creatorUsername = creatorUsername;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getParticipantUsers() {
        return participantUsers;
    }

    public void setParticipantUsers(String participantUsers) {
        this.participantUsers = participantUsers;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double langitude){
        this.longitude = longitude;
    }

}
