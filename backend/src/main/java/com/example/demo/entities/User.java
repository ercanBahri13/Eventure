package com.example.demo.entities;

import jakarta.persistence.*;
import java.util.Arrays;
import java.util.List;
import jakarta.persistence.*;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "users") // The table name in the DB will be 'users'
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String surname;

    @Column(unique = true) // Make email unique if you want
    private String email;

    @Column(unique = true) // Make username unique
    private String username;

    private String password; // We'll store hashed passwords normally, but for simplicity we keep plain text here

    private String phoneNumber;

    // We'll store interests as a comma-separated string in the DB
    private String interests;

    private String resetToken;

    public User() {
    }

    public User(String name, String surname, String email, String username, String password, String phoneNumber, String interests) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.username = username;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.interests = interests;
        this.resetToken = resetToken;
    }


    // Getters and setters for all fields

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

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    /**
     * Utility method to convert the comma-separated interests string to a list.
     */
    @Transient
    public List<String> getInterestsAsList() {
        if (this.interests == null || this.interests.trim().isEmpty()) {
            return List.of();
        }
        return Arrays.asList(this.interests.split("\\s*,\\s*"));
    }

    /**
     * Utility method to set interests by providing a list.
     */
    @Transient
    public void setInterestsFromList(List<String> interestsList) {
        this.interests = String.join(",", interestsList);
    }
}
