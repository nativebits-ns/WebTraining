package com.nachiket.leaveManagement.controller;

import com.nachiket.leaveManagement.dto.LeaveRequestDto;
import com.nachiket.leaveManagement.dto.LeaveResponse;
import com.nachiket.leaveManagement.exception.InvalidLeaveRequestException;
import com.nachiket.leaveManagement.exception.LeaveNotFoundException;
import com.nachiket.leaveManagement.model.LeaveStatus;
import com.nachiket.leaveManagement.model.LeaveType;
import com.nachiket.leaveManagement.service.LeaveService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LeaveController.class)
class LeaveControllerTest {

    private static final String VALID_BODY = """
            {
              "employeeId": "EMP001",
              "leaveType": "ANNUAL",
              "startDate": "2030-01-10",
              "endDate": "2030-01-12",
              "reason": "Vacation"
            }
            """;

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private LeaveService service;

    private LeaveResponse sample(Long id) {
        return new LeaveResponse(id, "EMP001", LeaveType.ANNUAL,
                LocalDate.of(2030, 1, 10), LocalDate.of(2030, 1, 12), "Vacation", LeaveStatus.PENDING);
    }

    @Test
    void getAll_returnsList() throws Exception {
        when(service.findAll()).thenReturn(List.of(sample(1L), sample(2L)));

        mockMvc.perform(get("/leaves"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void getById_returnsLeave() throws Exception {
        when(service.findById(1L)).thenReturn(sample(1L));

        mockMvc.perform(get("/leaves/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.employeeId").value("EMP001"))
                .andExpect(jsonPath("$.leaveType").value("ANNUAL"))
                .andExpect(jsonPath("$.startDate").value("2030-01-10"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getById_returns404WhenMissing() throws Exception {
        when(service.findById(99L)).thenThrow(new LeaveNotFoundException(99L));

        mockMvc.perform(get("/leaves/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Leave request with id 99 not found"))
                .andExpect(jsonPath("$.path").value("/leaves/99"));
    }

    @Test
    void getById_returns400ForNonNumericId() throws Exception {
        mockMvc.perform(get("/leaves/abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_returns201WithLocationHeader() throws Exception {
        when(service.create(any(LeaveRequestDto.class))).thenReturn(sample(7L));

        mockMvc.perform(post("/leaves").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.endsWith("/leaves/7")))
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void create_returns400WithFieldErrorsWhenBodyInvalid() throws Exception {
        String invalid = """
                {
                  "employeeId": " ",
                  "startDate": "2030-01-10",
                  "endDate": "2030-01-12"
                }
                """;

        mockMvc.perform(post("/leaves").contentType(MediaType.APPLICATION_JSON).content(invalid))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.details", hasSize(3)))
                .andExpect(jsonPath("$.details", hasItem("employeeId: employeeId must not be blank")))
                .andExpect(jsonPath("$.details", hasItem("leaveType: leaveType is required")))
                .andExpect(jsonPath("$.details", hasItem("reason: reason must not be blank")));
    }

    @Test
    void create_returns400ForUnknownEnumValue() throws Exception {
        String badEnum = VALID_BODY.replace("ANNUAL", "HOLIDAY");

        mockMvc.perform(post("/leaves").contentType(MediaType.APPLICATION_JSON).content(badEnum))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    void create_returns400ForMalformedJson() throws Exception {
        mockMvc.perform(post("/leaves").contentType(MediaType.APPLICATION_JSON).content("{ not json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void create_returns400WhenServiceRejectsBusinessRule() throws Exception {
        when(service.create(any(LeaveRequestDto.class)))
                .thenThrow(new InvalidLeaveRequestException("endDate must not be before startDate"));

        mockMvc.perform(post("/leaves").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("endDate must not be before startDate"));
    }

    @Test
    void update_returns200() throws Exception {
        when(service.update(eq(1L), any(LeaveRequestDto.class))).thenReturn(sample(1L));

        mockMvc.perform(put("/leaves/1").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void update_returns404WhenMissing() throws Exception {
        when(service.update(eq(5L), any(LeaveRequestDto.class))).thenThrow(new LeaveNotFoundException(5L));

        mockMvc.perform(put("/leaves/5").contentType(MediaType.APPLICATION_JSON).content(VALID_BODY))
                .andExpect(status().isNotFound());
    }

    @Test
    void update_returns400WhenBodyInvalid() throws Exception {
        mockMvc.perform(put("/leaves/1").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"));
    }

    @Test
    void delete_returns204() throws Exception {
        mockMvc.perform(delete("/leaves/1"))
                .andExpect(status().isNoContent());

        verify(service).delete(1L);
    }

    @Test
    void delete_returns404WhenMissing() throws Exception {
        doThrow(new LeaveNotFoundException(3L)).when(service).delete(3L);

        mockMvc.perform(delete("/leaves/3"))
                .andExpect(status().isNotFound());
    }

    @Test
    void unsupportedMethod_returns405NotServerError() throws Exception {
        mockMvc.perform(delete("/leaves"))
                .andExpect(status().isMethodNotAllowed());
    }
}
