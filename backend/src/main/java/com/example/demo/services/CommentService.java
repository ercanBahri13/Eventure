// backend/src/main/java/com/example/demo/services/CommentService.java
package com.example.demo.services;

import com.example.demo.dto.CommentResponse;
import com.example.demo.dto.CreateCommentRequest;
import com.example.demo.entities.Comment;
import com.example.demo.entities.Event;
import com.example.demo.entities.User;
import com.example.demo.enums.ReactionType;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.EventRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.stream.Collectors;


import java.util.stream.Collectors;

@Service
public class CommentService {
    @Autowired private CommentRepository   commentRepo;
    @Autowired private EventRepository     eventRepo;
    @Autowired private UserRepository      userRepo;
    @Autowired private ReactionService     reactionSvc;  // new service

    public CommentResponse postComment(Long eventId, CreateCommentRequest req, Long parentId) throws Exception {
        Event e = eventRepo.findById(eventId).orElseThrow(() -> new Exception("Event not found"));
        User u  = userRepo.findById(req.userId) .orElseThrow(() -> new Exception("User not found"));
        Comment c = new Comment();
        c.setEvent(e);
        c.setAuthor(u);
        c.setContent(req.content);
        if (parentId != null) {
            Comment p = commentRepo.findById(parentId).orElseThrow(() -> new Exception("Parent not found"));
            c.setParent(p);
        }
        commentRepo.save(c);
        // —–– Mentions: find all @username in the content
        Pattern pattern = Pattern.compile("@(\\w+)");
        Matcher matcher = pattern.matcher(req.content);
        while (matcher.find()) {
            String username = matcher.group(1);
            User mentioned = userRepo.findByUsername(username);
            if (mentioned != null) {
                notificationSvc.mentionNotify(mentioned.getId(), u.getId(), eventId);
            }
        }
        return toDto(c, e.getCreator().getId());
    }

    public CommentResponse pinComment(Long eventId, Long commentId, Long userId) throws Exception {
        Event e = eventRepo.findById(eventId).orElseThrow();
        if (!e.getCreator().getId().equals(userId))
            throw new Exception("Only organizer may pin");
        Comment c = commentRepo.findById(commentId).orElseThrow();
        c.setPinned(!c.isPinned());
        commentRepo.save(c);
        return toDto(c, e.getCreator().getId());
    }

    public Page<CommentResponse> getComments(Long eventId, int page, int size) throws Exception {
        Event e = eventRepo.findById(eventId).orElseThrow(() -> new Exception("Event not found"));
        Pageable pg = PageRequest.of(page, size,
                Sort.by("pinned").descending()
                        .and(Sort.by("createdAt").descending()));
        Page<Comment> p = commentRepo.findByEventAndParentIsNull(e, pg);
        Long orgId = e.getCreator() != null ? e.getCreator().getId() : null;
        return p.map(c -> {
            try {
                return toDto(c, orgId);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
        });
    }

    private CommentResponse toDto(Comment c, Long organizerId) throws Exception {
        CommentResponse r = new CommentResponse();
        r.id               = c.getId();
        r.authorId         = c.getAuthor().getId();
        r.authorName       = c.getAuthor().getUsername();
        r.content          = c.getContent();
        r.createdAt        = c.getCreatedAt();
        r.pinned           = c.isPinned();
        // Pull counts via ReactionService
        r.thumbsUpCount    = reactionSvc.countReactions(c.getId(), ReactionType.THUMBS_UP);
        r.heartCount       = reactionSvc.countReactions(c.getId(), ReactionType.HEART);
        r.laughCount       = reactionSvc.countReactions(c.getId(), ReactionType.LAUGH);
        r.isOrganizerReply = organizerId != null && c.getAuthor().getId().equals(organizerId);
        r.replies          = c.getReplies().stream()
                .map(child -> {
                    try {
                        return toDto(child, organizerId);
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());
        return r;
    }
    @Autowired private NotificationService notificationSvc;




}
