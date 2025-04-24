package com.example.demo.services;

import com.example.demo.controllers.UserController.UserUpdateRequest;
import com.example.demo.entities.Event;
import com.example.demo.entities.User;
import com.example.demo.repositories.EventRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    // 1. User Registration
    public User registerUser(User user) throws Exception {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new Exception("Username already in use");
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new Exception("Email already in use");
        }
        return userRepository.save(user);
    }

    // 2. User Login
    public User loginUser(String username, String password) throws Exception {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser == null || !existingUser.getPassword().equals(password)) {
            throw new Exception("Invalid username or password");
        }
        return existingUser;
    }

    // 3. Password Reset Token
    public void generateResetToken(String email) throws Exception {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new Exception("Email not found");
        }
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        userRepository.save(user);
        System.out.println("Simulating email: Your reset token = " + token);
    }

    // 4. Password Reset
    public void resetPassword(String token, String newPassword) throws Exception {
        User user = userRepository.findByResetToken(token);
        if (user == null) {
            throw new Exception("Invalid token");
        }
        user.setPassword(newPassword);
        user.setResetToken(null);
        userRepository.save(user);
    }

    // 5. Save Event for User
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

    // 6. Register Event for User
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

    // 7. Get User Profile by ID
    public User getUserProfile(Long id) throws Exception {
        return userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
    }

    // 8. Update User Profile Info
    public User updateUserProfile(Long id, UserUpdateRequest updateRequest) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));

        if (updateRequest.getName() != null) user.setName(updateRequest.getName());
        if (updateRequest.getSurname() != null) user.setSurname(updateRequest.getSurname());
        if (updateRequest.getEmail() != null) user.setEmail(updateRequest.getEmail());
        if (updateRequest.getPhoneNumber() != null) user.setPhoneNumber(updateRequest.getPhoneNumber());
        if (updateRequest.getProfileImage() != null) user.setProfileImage(updateRequest.getProfileImage());

        return userRepository.save(user);
    }

    // 9. Update User's Profile Image Only
    public void updateUserProfileImage(Long userId, String imageUrl) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        user.setProfileImage(imageUrl);
        userRepository.save(user);
    }

    // 10. Add Friend to User
    public User addFriend(Long userId, Long friendId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found with ID: " + userId));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new Exception("Friend not found with ID: " + friendId));

        user.addFriend(friend);
        return userRepository.save(user);
    }

    // 11. Get User's Friends
    public List<User> getFriends(Long id) throws Exception {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new Exception("User not found with ID: " + id));
        return user.getFriends();
    }

    // 12. Search Users
    public List<User> searchUsers(String query) {
        return userRepository.findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
    }
}
