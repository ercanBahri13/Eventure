package com.example.demo.repositories;

import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // We can add extra query methods if needed
    User findByUsername(String username);
    User findByEmail(String email);
    User findByResetToken(String resetToken);

    List<User> findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(String username, String name);

}

