package com.example.demo.entities;

import jakarta.persistence.*;
import com.example.demo.enums.RequestStatus;
import com.example.demo.entities.User;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "friend_requests")
public class FriendRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private User fromUser;

    @ManyToOne
    @JsonBackReference
    private User toUser;

    @Enumerated(EnumType.STRING)
    private RequestStatus status; // PENDING, ACCEPTED, REJECTED

    public FriendRequest() {}

    public FriendRequest(User fromUser, User toUser) {
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.status = RequestStatus.PENDING;
    }

    // getters and setters
    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
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

}
