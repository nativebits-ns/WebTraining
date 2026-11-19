package com.nachiket.leaveManagement.repository;

import com.nachiket.leaveManagement.model.LeaveRequest;
import org.springframework.stereotype.Repository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class LeaveRepository implements LeaveRepositoryInterface {

    private final ConcurrentMap<Long, LeaveRequest> store = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong();

    @Override
    public List<LeaveRequest> findAll() {
        return store.values().stream()
                .sorted(Comparator.comparing(LeaveRequest::getId))
                .toList();
    }

    @Override
    public Optional<LeaveRequest> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public LeaveRequest save(LeaveRequest leave) {
        if (leave.getId() == null) {
            leave.setId(sequence.incrementAndGet());
        }
        store.put(leave.getId(), leave);
        return leave;
    }

    @Override
    public boolean deleteById(Long id) {
        return store.remove(id) != null;
    }
}
