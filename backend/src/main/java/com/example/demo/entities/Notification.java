// backend/src/main/java/com/example/demo/entities/Notification.java
package com.example.demo.entities;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name="notifications")
public class Notification {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    private User recipient;

    @Column(columnDefinition="TEXT")
    private String message;

    private boolean read = false;
    private Instant createdAt = Instant.now();

    // Getters & setters
    public Long   getId()          { return id; }
    public User   getRecipient()   { return recipient; }
    public void   setRecipient(User r) { this.recipient = r; }
    public String getMessage()     { return message; }
    public void   setMessage(String m){ this.message = m; }
    public boolean isRead()        { return read; }
    public void   setRead(boolean r){ this.read = r; }
    public Instant getCreatedAt()  { return createdAt; }
}
