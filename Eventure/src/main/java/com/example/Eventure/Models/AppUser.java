package com.example.Eventure.Models;



import java.io.Serializable;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;;

@Entity
@Table(name= "App_Users")
public class AppUser implements Serializable{
    private @Id
  @GeneratedValue(strategy=GenerationType.AUTO) Long id;
  private String userName;
  private String email;
  private int phoneNumber;
  List<String> interests;

  @ManyToMany (fetch = FetchType.EAGER)
	@JoinTable(name = "Users_Events", 
	joinColumns = @JoinColumn(name = "AppUser_id"), 
	inverseJoinColumns = @JoinColumn(name = "Event_id"))
	private List<Event> events;
  AppUser() {};
  AppUser(String name) {};
}
