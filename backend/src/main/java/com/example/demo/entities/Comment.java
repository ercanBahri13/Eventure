// backend/src/main/java/com/example/demo/entities/Comment.java
package com.example.demo.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comments")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Comment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="event_id")
    @JsonIgnoreProperties({"comments","registeredUsers","savedByUsers"})
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    @JsonIgnoreProperties({"friends","savedEvents","registeredEvents","createdEvents"})
    private User author;

    @Column(columnDefinition="TEXT")
    private String content;

    private Instant createdAt = Instant.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="parent_id")
    @JsonIgnoreProperties({"replies"})
    private Comment parent;

    @OneToMany(mappedBy="parent", cascade=CascadeType.ALL, fetch=FetchType.LAZY)
    @OrderBy("createdAt ASC")
    private List<Comment> replies = new ArrayList<>();

    private boolean pinned = false;

    private int likeCount = 0;

    // ----------------- Getters and Setters -----------------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public User getAuthor() {
        return author;
    }

    public void setAuthor(User author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Comment getParent() {
        return parent;
    }

    public void setParent(Comment parent) {
        this.parent = parent;
    }

    public List<Comment> getReplies() {
        return replies;
    }

    public void setReplies(List<Comment> replies) {
        this.replies = replies;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }
}
