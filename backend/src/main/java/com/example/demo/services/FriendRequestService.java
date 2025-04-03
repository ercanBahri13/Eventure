package com.example.demo.services;

import com.example.demo.entities.FriendRequest;
import com.example.demo.entities.User;
import com.example.demo.enums.RequestStatus;
import com.example.demo.repositories.FriendRequestRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendRequestService {

    @Autowired
    private FriendRequestRepository friendRequestRepository;

    @Autowired
    private UserRepository userRepository;

    public FriendRequest createRequest(Long fromUserId, Long toUserId) throws Exception {
        User from = userRepository.findById(fromUserId)
                .orElseThrow(() -> new Exception("User not found: " + fromUserId));
        User to = userRepository.findById(toUserId)
                .orElseThrow(() -> new Exception("User not found: " + toUserId));

        // Optionally check if there's already a request or if they're already friends
        FriendRequest fr = new FriendRequest(from, to);
        return friendRequestRepository.save(fr);
    }

    public List<FriendRequest> getRequestsForUser(Long userId) {
        return friendRequestRepository.findByToUserIdAndStatus(userId, RequestStatus.PENDING);
    }

    public FriendRequest acceptRequest(Long requestId) throws Exception {
        FriendRequest fr = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new Exception("Request not found: " + requestId));
        fr.setStatus(RequestStatus.ACCEPTED);

        User from = fr.getFromUser();
        User to = fr.getToUser();

        // Add each other as friends if you want symmetrical friendship
        from.addFriend(to);
        to.addFriend(from);

        userRepository.save(from);
        userRepository.save(to);

        return friendRequestRepository.save(fr);
    }

    public FriendRequest rejectRequest(Long requestId) throws Exception {
        FriendRequest fr = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new Exception("Request not found: " + requestId));
        fr.setStatus(RequestStatus.REJECTED);
        return friendRequestRepository.save(fr);
    }
}
