// backend/src/main/java/com/example/demo/dto/EventResponse.java
package com.example.demo.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class EventResponse {
    public Long id;
    public String name;
    public String type;
    public String creatorUsername;
    public Long creatorId;
    public LocalDate date;
    public LocalTime startTime;
    public LocalTime endTime;
    public String city;
    public String location;
    public int capacity;
    public String imageUrl;
    public double latitude;
    public double longitude;
}
