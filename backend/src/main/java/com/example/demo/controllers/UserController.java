package com.example.demo.controllers;

import com.example.demo.entities.User;
import com.example.demo.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public User getUserProfile(@PathVariable Long id) throws Exception {
        return userService.getUserProfile(id);
    }

    @PutMapping("/{id}")
    public User updateUserProfile(@PathVariable Long id, @RequestBody UserUpdateRequest updateRequest) throws Exception {
        return userService.updateUserProfile(id, updateRequest);
    }

    @PostMapping("/{userId}/add-friend/{friendId}")
    public User addFriend(@PathVariable Long userId, @PathVariable Long friendId) throws Exception {
        return userService.addFriend(userId, friendId);
    }

    @GetMapping("/{id}/friends")
    public List<User> getFriends(@PathVariable Long id) throws Exception {
        return userService.getFriends(id);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String query) {
        return userService.searchUsers(query);
    }

    @PostMapping("/{id}/upload-image")
    public ResponseEntity<String> uploadProfileImage(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File is empty.");
            }

            String contentType = file.getContentType();
            if (!(contentType.equals("image/jpeg") || contentType.equals("image/png"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Only JPEG and PNG images are allowed.");
            }

            long maxSize = 5 * 1024 * 1024; // 5MB
            if (file.getSize() > maxSize) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File size exceeds 5MB.");
            }

            String folder = "uploads/";
            Files.createDirectories(Paths.get(folder));

            String extension = contentType.equals("image/png") ? ".png" : ".jpg";
            String filename = "user_" + id + "_" + UUID.randomUUID() + extension;
            Path path = Paths.get(folder + filename);
            Files.write(path, file.getBytes());

            String imageUrl = "http://10.0.2.2:8080/uploads/" + filename;
            userService.updateUserProfileImage(id, imageUrl);

            return ResponseEntity.ok(imageUrl);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}/delete-image")
    public ResponseEntity<?> deleteProfileImage(@PathVariable Long id) {
        try {
            userService.updateUserProfileImage(id, "");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Could not delete image");
        }
    }

    public static class UserUpdateRequest {
        private String name;
        private String surname;
        private String email;
        private String phoneNumber;
        private String profileImage;

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
