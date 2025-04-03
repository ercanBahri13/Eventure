package com.example.demo.entities;

import com.example.demo.enums.RequestStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "friend_requests")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "from_user_id")
    // Avoid infinite recursion by ignoring large fields in 'User'
    @JsonIgnoreProperties({
            "friends", "savedEvents", "registeredEvents", "createdEvents",
            "password", "resetToken", "interests", "phoneNumber"
    })
    private User fromUser;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "to_user_id")
    @JsonIgnoreProperties({
            "friends", "savedEvents", "registeredEvents", "createdEvents",
            "password", "resetToken", "interests", "phoneNumber"
    })
    private User toUser;

    @Enumerated(EnumType.STRING)
    private RequestStatus status; // PENDING, ACCEPTED, REJECTED

    public FriendRequest() {
        this.status = RequestStatus.PENDING;
    }

    public FriendRequest(User fromUser, User toUser) {
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.status = RequestStatus.PENDING;
    }

    public Long getId() {
        return id;
    }

    public User getFromUser() {
        return fromUser;
    }
    public void setFromUser(User fromUser) {
        this.fromUser = fromUser;
    }

    public User getToUser() {
        return toUser;
    }
    public void setToUser(User toUser) {
        this.toUser = toUser;
    }

    public RequestStatus getStatus() {
        return status;
    }
    public void setStatus(RequestStatus status) {
        this.status = status;
    }
}
