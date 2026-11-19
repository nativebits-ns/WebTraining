package com.nachiket.leaveManagement.service;

import com.nachiket.leaveManagement.configuration.LeaveProperties;
import com.nachiket.leaveManagement.dto.LeaveRequestDto;
import com.nachiket.leaveManagement.dto.LeaveResponse;
import com.nachiket.leaveManagement.exception.InvalidLeaveRequestException;
import com.nachiket.leaveManagement.exception.LeaveNotFoundException;
import com.nachiket.leaveManagement.model.LeaveRequest;
import com.nachiket.leaveManagement.model.LeaveStatus;
import com.nachiket.leaveManagement.repository.LeaveRepositoryInterface;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepositoryInterface repository;
    private final Clock clock;
    private final LeaveProperties properties;

    public LeaveService(LeaveRepositoryInterface repository, Clock clock, LeaveProperties properties) {
        this.repository = repository;
        this.clock = clock;
        this.properties = properties;
    }

    public List<LeaveResponse> findAll() {
        return repository.findAll().stream().map(LeaveResponse::from).toList();
    }

    public LeaveResponse findById(Long id) {
        return LeaveResponse.from(getOrThrow(id));
    }

    public LeaveResponse create(LeaveRequestDto dto) {
        validateDates(dto);
        if (dto.startDate().isBefore(LocalDate.now(clock))) {
            throw new InvalidLeaveRequestException("startDate must not be in the past");
        }
        LeaveRequest leave = new LeaveRequest(null, dto.employeeId(), dto.leaveType(),
                dto.startDate(), dto.endDate(), dto.reason(), LeaveStatus.PENDING);
        return LeaveResponse.from(repository.save(leave));
    }

    public LeaveResponse update(Long id, LeaveRequestDto dto) {
        LeaveRequest existing = getOrThrow(id);
        validateDates(dto);
        existing.setEmployeeId(dto.employeeId());
        existing.setLeaveType(dto.leaveType());
        existing.setStartDate(dto.startDate());
        existing.setEndDate(dto.endDate());
        existing.setReason(dto.reason());
        if (dto.status() != null) {
            existing.setStatus(dto.status());
        }
        return LeaveResponse.from(repository.save(existing));
    }

    public void delete(Long id) {
        if (!repository.deleteById(id)) {
            throw new LeaveNotFoundException(id);
        }
    }

    private LeaveRequest getOrThrow(Long id) {
        return repository.findById(id).orElseThrow(() -> new LeaveNotFoundException(id));
    }

    private void validateDates(LeaveRequestDto dto) {
        if (dto.endDate().isBefore(dto.startDate())) {
            throw new InvalidLeaveRequestException("endDate must not be before startDate");
        }
        long days = ChronoUnit.DAYS.between(dto.startDate(), dto.endDate()) + 1;
        if (days > properties.maxDurationDays()) {
            throw new InvalidLeaveRequestException(
                    "Leave duration of " + days + " days exceeds the maximum of "
                            + properties.maxDurationDays() + " days");
        }
    }
}
