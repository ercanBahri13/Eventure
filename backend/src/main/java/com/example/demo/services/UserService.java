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

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

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

    // Additional methods if needed...
}
