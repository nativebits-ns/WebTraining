package com.nachiket.leaveManagement.configuration;

import com.nachiket.leaveManagement.model.LeaveRequest;
import com.nachiket.leaveManagement.model.LeaveStatus;
import com.nachiket.leaveManagement.model.LeaveType;
import com.nachiket.leaveManagement.repository.LeaveRepositoryInterface;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@Profile("dev")
public class DataLoader implements CommandLineRunner {

    private final LeaveRepositoryInterface repository;

    public DataLoader(LeaveRepositoryInterface repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        LocalDate today = LocalDate.now();
        repository.save(new LeaveRequest(null, "EMP001", LeaveType.ANNUAL,
                today.plusDays(14), today.plusDays(18), "Family vacation", LeaveStatus.PENDING));
        repository.save(new LeaveRequest(null, "EMP002", LeaveType.SICK,
                today.minusDays(2), today.minusDays(1), "Fever", LeaveStatus.APPROVED));
    }
}
