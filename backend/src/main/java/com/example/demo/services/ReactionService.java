// backend/src/main/java/com/example/demo/services/ReactionService.java
package com.example.demo.services;

import com.example.demo.entities.Comment;
import com.example.demo.entities.Reaction;
import com.example.demo.entities.User;
import com.example.demo.enums.ReactionType;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.ReactionRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReactionService {
    @Autowired private ReactionRepository reactionRepo;
    @Autowired private CommentRepository   commentRepo;
    @Autowired private UserRepository      userRepo;

    public void toggleReaction(Long commentId, Long userId, ReactionType type) throws Exception {
        Comment c = commentRepo.findById(commentId).orElseThrow(() -> new Exception("Comment not found"));
        User    u = userRepo.findById(userId)       .orElseThrow(() -> new Exception("User not found"));
        var existing = reactionRepo.findByCommentAndUserAndType(c,u,type);
        if (existing.isPresent()) reactionRepo.delete(existing.get());
        else {
            Reaction r = new Reaction();
            r.setComment(c);
            r.setUser(u);
            r.setType(type);
            reactionRepo.save(r);
        }
    }

    public long countReactions(Long commentId, ReactionType type) throws Exception {
        Comment c = commentRepo.findById(commentId).orElseThrow(() -> new Exception("Comment not found"));
        return reactionRepo.countByCommentAndType(c, type);
    }
}
