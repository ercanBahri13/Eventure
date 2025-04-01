package com.example.demo.repositories;

import com.example.demo.entities.FriendRequest;
import com.example.demo.enums.RequestStatus;
import com.example.demo.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    List<FriendRequest> findByToUserIdAndStatus(Long toUserId, RequestStatus status);
}
