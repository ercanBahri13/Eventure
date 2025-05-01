// backend/src/main/java/com/example/demo/repositories/ReactionRepository.java
package com.example.demo.repositories;

import com.example.demo.entities.Comment;
import com.example.demo.entities.Reaction;
import com.example.demo.enums.ReactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import com.example.demo.entities.User;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    long countByCommentAndType(Comment comment, ReactionType type);
    Optional<Reaction> findByCommentAndUserAndType(Comment comment, User user, ReactionType type);
}
