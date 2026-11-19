package com.nachiket.leaveManagement.repository;

import com.nachiket.leaveManagement.model.LeaveRequest;

import java.util.List;
import java.util.Optional;

public interface LeaveRepositoryInterface {

    List<LeaveRequest> findAll();

    Optional<LeaveRequest> findById(Long id);

    LeaveRequest save(LeaveRequest leave);

    boolean deleteById(Long id);
}
