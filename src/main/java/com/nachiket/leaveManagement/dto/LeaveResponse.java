package com.nachiket.leaveManagement.dto;

import com.nachiket.leaveManagement.model.LeaveRequest;
import com.nachiket.leaveManagement.model.LeaveStatus;
import com.nachiket.leaveManagement.model.LeaveType;

import java.time.LocalDate;

public record LeaveResponse(
        Long id,
        String employeeId,
        LeaveType leaveType,
        LocalDate startDate,
        LocalDate endDate,
        String reason,
        LeaveStatus status
) {

    public static LeaveResponse from(LeaveRequest leave) {
        return new LeaveResponse(
                leave.getId(),
                leave.getEmployeeId(),
                leave.getLeaveType(),
                leave.getStartDate(),
                leave.getEndDate(),
                leave.getReason(),
                leave.getStatus());
    }
}
