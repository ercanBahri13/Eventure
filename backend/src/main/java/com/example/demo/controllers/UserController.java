package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // 1) Get user profile by ID (includes friends, events, etc.)
    @GetMapping("/{id}")
    public User getUserProfile(@PathVariable Long id) throws Exception {
        return userService.getUserProfile(id);
    }

    // 2) Update user profile info
    @PutMapping("/{id}")
    public User updateUserProfile(@PathVariable Long id, @RequestBody UserUpdateRequest updateRequest) throws Exception {
        return userService.updateUserProfile(id, updateRequest);
    }

    // 3) Add a friend
    @PostMapping("/{userId}/add-friend/{friendId}")
    public User addFriend(@PathVariable Long userId, @PathVariable Long friendId) throws Exception {
        return userService.addFriend(userId, friendId);
    }

    // If you want an endpoint to get just the friend list
    @GetMapping("/{id}/friends")
    public List<User> getFriends(@PathVariable Long id) throws Exception {
        return userService.getFriends(id);
    }

    // You could add removeFriend, etc. if needed.



    // A small DTO for updating user info
    public static class UserUpdateRequest {
        private String name;
        private String surname;
        private String email;
        private String phoneNumber;
        private String profileImage;

        // getters, setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getSurname() { return surname; }
        public void setSurname(String surname) { this.surname = surname; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

        public String getProfileImage() { return profileImage; }
        public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    }
}
