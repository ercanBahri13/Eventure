package com.example.Eventure.Models;

import jakarta.persistence.Embeddable;

@Embeddable
public class Location {
    private String city;
    private String district;
    private String address;

    private Double latitude; // Geographical latitude
    private Double longitude; // Geographical longitude

    Location () {};
    // Getters and Setters
    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    public void setAddress(String value) {
        this.address = value;
    }
}
