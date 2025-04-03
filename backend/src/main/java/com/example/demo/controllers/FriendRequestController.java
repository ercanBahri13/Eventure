package com.example.demo.controllers;

import com.example.demo.entities.FriendRequest;
import com.example.demo.services.FriendRequestService;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

@RestController
@RequestMapping("/friend-requests")
@CrossOrigin(origins = "*")
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    @GetMapping("/{userId}")
    public List<FriendRequest> getRequestsForUser(@PathVariable Long userId) {
        // returns pending requests for that user
        return friendRequestService.getRequestsForUser(userId);
    }

    @PostMapping
    public FriendRequest createRequest(@RequestBody CreateFriendRequest req) throws Exception {
        return friendRequestService.createRequest(req.getFromUserId(), req.getToUserId());
    }

    @PostMapping("/{id}/accept")
    public FriendRequest acceptRequest(@PathVariable Long id) throws Exception {
        return friendRequestService.acceptRequest(id);
    }

    @PostMapping("/{id}/reject")
    public FriendRequest rejectRequest(@PathVariable Long id) throws Exception {
        return friendRequestService.rejectRequest(id);
    }

    // Inner DTO
    public static class CreateFriendRequest {
        private Long fromUserId;
        private Long toUserId;

        public Long getFromUserId() { return fromUserId; }
        public void setFromUserId(Long fromUserId) { this.fromUserId = fromUserId; }

        public Long getToUserId() { return toUserId; }
        public void setToUserId(Long toUserId) { this.toUserId = toUserId; }
    }
}
