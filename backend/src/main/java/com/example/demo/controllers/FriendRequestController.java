package com.example.demo.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;

import com.example.demo.entities.FriendRequest;
import com.example.demo.services.FriendRequestService;
import com.example.demo.enums.RequestStatus;
@RestController
@RequestMapping("/friend-requests")
@CrossOrigin(origins = "*")
public class FriendRequestController {

    @Autowired
    private FriendRequestService friendRequestService;

    @GetMapping("/{userId}")
    public List<FriendRequest> getRequestsForUser(@PathVariable Long userId) {
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
