// backend/src/main/java/com/example/demo/entities/Reaction.java
package com.example.demo.entities;

import com.example.demo.enums.ReactionType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "reactions")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Reaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="comment_id", nullable=false)
    @JsonIgnoreProperties("reactions")
    private Comment comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    @JsonIgnoreProperties({"friends","savedEvents","registeredEvents","createdEvents"})
    private User user;

    @Enumerated(EnumType.STRING)
    private ReactionType type;

    // getters & setters
    public Long getId() { return id; }
    public Comment getComment() { return comment; }
    public void setComment(Comment comment) { this.comment = comment; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public ReactionType getType() { return type; }
    public void setType(ReactionType type) { this.type = type; }
}
