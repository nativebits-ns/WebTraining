package com.nachiket.leaveManagement.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "leave")
public record LeaveProperties(@DefaultValue("30") int maxDurationDays) {
}
