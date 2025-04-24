package com.example.demo.dto;

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
}
