package com.example.demo.services;

import com.example.demo.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    // Additional methods if needed...
}
