// backend/src/main/java/com/example/demo/repositories/CommentRepository.java
package com.example.demo.repositories;

import com.example.demo.entities.Comment;
import com.example.demo.entities.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    // Spring Data will automatically implement this:
    Page<Comment> findByEventAndParentIsNull(Event event, Pageable pageable);
}