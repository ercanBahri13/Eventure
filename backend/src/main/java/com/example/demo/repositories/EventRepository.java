package com.example.demo.repositories;

import com.example.demo.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    // For searching by name (contains)
    List<Event> findByNameContainingIgnoreCase(String name);
}
