package com.example.Eventure;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.Eventure.Models.Event;




@Repository
public interface EventRepository extends JpaRepository<Event, Long>{
}