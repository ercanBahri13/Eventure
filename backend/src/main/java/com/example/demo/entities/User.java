package com.example.demo.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Entity
@JsonIgnoreProperties({ "friends", "hibernateLazyInitializer", "handler" })
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String surname;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String username;

    private String password;
    private String phoneNumber;
    private List<String> interests;
    private String resetToken;
    private String profileImage;

    // Many-to-Many: Saved Events
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_saved_events",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private List<Event> savedEvents = new ArrayList<>();

    // Many-to-Many: Registered Events
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_registered_events",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private List<Event> registeredEvents = new ArrayList<>();

    // Many-to-Many: Friends
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_friends",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    private List<User> friends = new ArrayList<>();

    // One-to-Many: Created Events
    @OneToMany(mappedBy = "creator", fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Event> createdEvents = new ArrayList<>();

    // Constructors
    public User() {}

    public User(String name, String surname, String email, String username, String password, String phoneNumber, List<String> interests) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.username = username;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.interests = interests;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSurname() { return surname; }
    public void setSurname(String surname) { this.surname = surname; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public List<User> getFriends() { return friends; }
    public void setFriends(List<User> friends) { this.friends = friends; }

    public List<Event> getCreatedEvents() { return createdEvents; }
    public void setCreatedEvents(List<Event> createdEvents) { this.createdEvents = createdEvents; }

    public List<Event> getSavedEvents() { return savedEvents; }
    public void setSavedEvents(List<Event> savedEvents) { this.savedEvents = savedEvents; }

    public List<Event> getRegisteredEvents() { return registeredEvents; }
    public void setRegisteredEvents(List<Event> registeredEvents) { this.registeredEvents = registeredEvents; }

    // Utility Methods
    public void addFriend(User friend) {
        if (!this.friends.contains(friend)) {
            this.friends.add(friend);
        }
    }

    public void addSavedEvent(Event event) {
        if (!this.savedEvents.contains(event)) {
            this.savedEvents.add(event);
        }
    }

    public void addRegisteredEvent(Event event) {
        if (!this.registeredEvents.contains(event)) {
            this.registeredEvents.add(event);
        }
    }
}
