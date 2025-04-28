// backend/src/main/java/com/example/demo/controllers/CommentController.java
package com.example.demo.controllers;

import com.example.demo.dto.CommentResponse;
import com.example.demo.dto.CreateCommentRequest;
import com.example.demo.enums.ReactionType;
import com.example.demo.services.CommentService;
import com.example.demo.services.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/events/{eventId}/comments")
@CrossOrigin(origins = "*")
public class CommentController {
    @Autowired private CommentService svc;
    @Autowired private ReactionService reactSvc;
    // 1) List top-level comments, newest first, paginated
    @GetMapping
    public Page<CommentResponse> list(
            @PathVariable Long eventId,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="20") int size
    ) throws Exception {
        return svc.getComments(eventId, page, size);
    }

    // 2) Post a new top-level comment
    @PostMapping
    public CommentResponse comment(
            @PathVariable Long eventId,
            @RequestBody CreateCommentRequest req
    ) throws Exception {
        return svc.postComment(eventId, req, null);
    }

    // 3) Reply to a comment
    @PostMapping("/{parentId}/reply")
    public CommentResponse reply(
            @PathVariable Long eventId,
            @PathVariable Long parentId,
            @RequestBody CreateCommentRequest req
    ) throws Exception {
        return svc.postComment(eventId, req, parentId);
    }
    // ─── pin/unpin endpoint
    @PostMapping("/{commentId}/pin")
    public CommentResponse pin(
            @PathVariable Long eventId,
            @PathVariable Long commentId,
            @RequestParam Long userId
    ) throws Exception {
        return svc.pinComment(eventId, commentId, userId);
    }

    // ─── emoji reactions endpoint
    @PostMapping("/{commentId}/reactions")
    public ResponseEntity<?> react(
            @PathVariable Long eventId,
            @PathVariable Long commentId,
            @RequestBody ReactionRequest req
    ) throws Exception {
        reactSvc.toggleReaction(commentId, req.userId, req.type);
        // return updated counts:
        long thumbs = reactSvc.countReactions(commentId, ReactionType.THUMBS_UP);
        long heart  = reactSvc.countReactions(commentId, ReactionType.HEART);
        long laugh  = reactSvc.countReactions(commentId, ReactionType.LAUGH);
        return ResponseEntity.ok(
                Map.of("thumbsUpCount", thumbs, "heartCount", heart, "laughCount", laugh)
        );
    }

    public static class ReactionRequest {
        public Long userId;
        public ReactionType type;
    }
}
