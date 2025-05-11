package com.example.demo.dto;
import java.util.List;
public class CreateEventRequest {
    public Long userId;
    public String name;
    public String type;
    public String date;
    public String startTime;
    public String endTime;
    public String city;
    public String location;
    public int capacity;
    public String imageUrl;
    private double latitude;
    private double longitude;
    private List<String> tags;

    public double getLatitude() {
        return latitude;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }
    public double getLongitude() {
        return longitude;
    }
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getTags() {
        return tags;
    }
}