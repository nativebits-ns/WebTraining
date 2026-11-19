package com.nachiket.leaveManagement.dto;

import com.nachiket.leaveManagement.model.LeaveStatus;
import com.nachiket.leaveManagement.model.LeaveType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record LeaveRequestDto(
        @NotBlank(message = "employeeId must not be blank")
        @Size(max = 50, message = "employeeId must be at most 50 characters")
        String employeeId,

        @NotNull(message = "leaveType is required")
        LeaveType leaveType,

        @NotNull(message = "startDate is required")
        LocalDate startDate,

        @NotNull(message = "endDate is required")
        LocalDate endDate,

        @NotBlank(message = "reason must not be blank")
        @Size(max = 500, message = "reason must be at most 500 characters")
        String reason,

        LeaveStatus status
) {
}
