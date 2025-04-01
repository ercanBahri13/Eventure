package com.example.demo.services;

import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
import com.example.demo.entities.Event;
import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.controllers.UserController.UserUpdateRequest;

import java.util.UUID;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    public User registerUser(User user) throws Exception {
        // Check if username or email already exists
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new Exception("Username already in use");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new Exception("Email already in use");
        }

        // Here is where you could hash the password before saving
        // e.g. user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user
        return userRepository.save(user);
    }

    public User loginUser(String username, String password) throws Exception {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser == null) {
            throw new Exception("User not found");
        }

        // For a real app, compare hashed password here
        if (!existingUser.getPassword().equals(password)) {
            throw new Exception("Invalid password");
        }

        return existingUser;
    }
    public void generateResetToken(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("Email not found");
        }
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);

        // In a real app, you'd send an email containing this link or token
        System.out.println("Simulating email: Your reset token = " + token);
    }

    public void resetPassword(String token, String newPassword) throws Exception {
        // find user by resetToken
        User user = userRepository.findByResetToken(token);
        if (user == null) {
            throw new Exception("Invalid token");
        }
        user.setPassword(newPassword); // you would hash in real app
        user.setResetToken(null);      // clear the token
        userRepository.save(user);
    }

    public void saveEventForUser(Long userId, Long eventId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found with ID: " + eventId));

        if (user.getSavedEvents().contains(event)) {
            throw new Exception("You already saved this event.");
        }

        user.addSavedEvent(event);
        userRepository.save(user);
    }

    public void registerEventForUser(Long userId, Long eventId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new Exception("Event not found with ID: " + eventId));

        if (user.getRegisteredEvents().contains(event)) {
            throw new Exception("You are already registered for this event.");
        }

        user.addRegisteredEvent(event);
        userRepository.save(user);
    }

    public User getUserProfile(Long id) throws Exception {
        // Eagerly load user if needed. If using LAZY, you might want to initialize the relationships
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
        return user;
    }

    public User updateUserProfile(Long id, UserUpdateRequest updateRequest) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));

        if (updateRequest.getName() != null) {
            user.setName(updateRequest.getName());
        }
        if (updateRequest.getSurname() != null) {
            user.setSurname(updateRequest.getSurname());
        }
        if (updateRequest.getEmail() != null) {
            user.setEmail(updateRequest.getEmail());
        }
        if (updateRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }
        if (updateRequest.getProfileImage() != null) {
            user.setProfileImage(updateRequest.getProfileImage());
        }

        return userRepository.save(user);
    }
    public User addFriend(Long userId, Long friendId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new Exception("Friend not found with ID: " + friendId));

        // Add friend both ways if you prefer a bidirectional approach
        user.addFriend(friend);
        // friend.addFriend(user); // If you want symmetrical friendship

        userRepository.save(user);
        // userRepository.save(friend); // if you want symmetrical friendship

        return user;
    }

    public List<User> getFriends(Long id) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
        return user.getFriends();
    }

    public List<User> searchUsers(String query) {
        // Suppose we have a custom query in the UserRepository
        return userRepository.findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
    }

    // Additional methods if needed...
}
