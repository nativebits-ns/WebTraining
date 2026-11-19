package com.nachiket.leaveManagement.exception;

public class LeaveNotFoundException extends RuntimeException {

    public LeaveNotFoundException(Long id) {
        super("Leave request with id " + id + " not found");
    }
}
