package com.example.Eventure.Models;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;
import com.example.Eventure.Models.AppUser;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;;

@Entity
@Table(name = "Events")
public class Event implements Serializable {
    private @Id
  @GeneratedValue Long id;
  private String name;
  private String description;
  @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
  private Date date;
  List<String> tags;
  @ManyToMany(mappedBy = "events") // 'event' is the field in the Attendant class
  private List<AppUser> listOfAttendants;
  @Embedded
  private Location location;

  Event() {};
  Event(String name, String description, Date date) {location = new Location();}
  
  @Override
  public String toString() {
    return String.format(
        "Event[id=%d, firstName='%s', lastName='%s',date:%s]",
        id, name, description);
  }
  public void setId(Long id) {
    this.id = id;
  }
  public Long getId() {
    return id;
  }
  public String getName() {
    return name;
  }
  public String getDescription() {
    return this.description;
  }
  public void setDescription(String description) {
    this.description= description;
  }
  public Date getDate() {
    return date;
  }
 public void setLocation(Location location) {
  this.location = location;
 }
 public Location getLocation() {
  return this.location;
 }
}
