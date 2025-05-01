// backend/src/main/java/com/example/demo/dto/CommentResponse.java
package com.example.demo.dto;

import java.time.Instant;
import java.util.List;

public class CommentResponse {
    public Long id;
    public Long authorId;
    public String authorName;
    public String content;
    public Instant createdAt;
    public boolean pinned;
    public int likeCount;
    public boolean isOrganizerReply;
    public List<CommentResponse> replies;
    public long thumbsUpCount;
    public long heartCount;
    public long laughCount;

}