package com.nachiket.leaveManagement.service;

import com.nachiket.leaveManagement.configuration.LeaveProperties;
import com.nachiket.leaveManagement.dto.LeaveRequestDto;
import com.nachiket.leaveManagement.dto.LeaveResponse;
import com.nachiket.leaveManagement.exception.InvalidLeaveRequestException;
import com.nachiket.leaveManagement.exception.LeaveNotFoundException;
import com.nachiket.leaveManagement.model.LeaveRequest;
import com.nachiket.leaveManagement.model.LeaveStatus;
import com.nachiket.leaveManagement.model.LeaveType;
import com.nachiket.leaveManagement.repository.LeaveRepositoryInterface;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LeaveServiceTest {

    private static final LocalDate TODAY = LocalDate.of(2026, 11, 19);

    @Mock
    private LeaveRepositoryInterface repository;

    private LeaveService service;

    @BeforeEach
    void setUp() {
        Clock fixedClock = Clock.fixed(Instant.parse("2026-11-19T10:00:00Z"), ZoneOffset.UTC);
        service = new LeaveService(repository, fixedClock, new LeaveProperties(30));
    }

    private LeaveRequestDto dto(LocalDate start, LocalDate end, LeaveStatus status) {
        return new LeaveRequestDto("EMP001", LeaveType.ANNUAL, start, end, "Vacation", status);
    }

    private LeaveRequest existing(Long id) {
        return new LeaveRequest(id, "EMP001", LeaveType.ANNUAL, TODAY.plusDays(5), TODAY.plusDays(6),
                "Trip", LeaveStatus.PENDING);
    }

    @Test
    void create_savesRequestAsPendingAndIgnoresClientStatus() {
        when(repository.save(any(LeaveRequest.class))).thenAnswer(inv -> {
            LeaveRequest saved = inv.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        LeaveResponse response = service.create(dto(TODAY.plusDays(2), TODAY.plusDays(4), LeaveStatus.APPROVED));

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.status()).isEqualTo(LeaveStatus.PENDING);
        assertThat(response.employeeId()).isEqualTo("EMP001");

        ArgumentCaptor<LeaveRequest> captor = ArgumentCaptor.forClass(LeaveRequest.class);
        verify(repository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(LeaveStatus.PENDING);
    }

    @Test
    void create_allowsStartDateOfToday() {
        when(repository.save(any(LeaveRequest.class))).thenAnswer(inv -> inv.getArgument(0));

        LeaveResponse response = service.create(dto(TODAY, TODAY, null));

        assertThat(response.startDate()).isEqualTo(TODAY);
    }

    @Test
    void create_rejectsEndDateBeforeStartDate() {
        assertThatThrownBy(() -> service.create(dto(TODAY.plusDays(5), TODAY.plusDays(2), null)))
                .isInstanceOf(InvalidLeaveRequestException.class)
                .hasMessageContaining("endDate");
        verify(repository, never()).save(any());
    }

    @Test
    void create_rejectsStartDateInThePast() {
        assertThatThrownBy(() -> service.create(dto(TODAY.minusDays(1), TODAY.plusDays(1), null)))
                .isInstanceOf(InvalidLeaveRequestException.class)
                .hasMessageContaining("past");
        verify(repository, never()).save(any());
    }

    @Test
    void create_rejectsDurationAboveConfiguredMaximum() {
        assertThatThrownBy(() -> service.create(dto(TODAY.plusDays(1), TODAY.plusDays(31), null)))
                .isInstanceOf(InvalidLeaveRequestException.class)
                .hasMessageContaining("maximum");
        verify(repository, never()).save(any());
    }

    @Test
    void findAll_returnsMappedResponses() {
        when(repository.findAll()).thenReturn(List.of(existing(1L), existing(2L)));

        List<LeaveResponse> result = service.findAll();

        assertThat(result).extracting(LeaveResponse::id).containsExactly(1L, 2L);
    }

    @Test
    void findById_returnsResponseWhenFound() {
        when(repository.findById(1L)).thenReturn(Optional.of(existing(1L)));

        LeaveResponse response = service.findById(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.reason()).isEqualTo("Trip");
    }

    @Test
    void findById_throwsWhenMissing() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
                .isInstanceOf(LeaveNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void update_replacesFieldsAndChangesStatusWhenProvided() {
        when(repository.findById(1L)).thenReturn(Optional.of(existing(1L)));
        when(repository.save(any(LeaveRequest.class))).thenAnswer(inv -> inv.getArgument(0));

        LeaveRequestDto update = new LeaveRequestDto("EMP002", LeaveType.SICK,
                TODAY.plusDays(1), TODAY.plusDays(2), "Flu", LeaveStatus.APPROVED);
        LeaveResponse response = service.update(1L, update);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.employeeId()).isEqualTo("EMP002");
        assertThat(response.leaveType()).isEqualTo(LeaveType.SICK);
        assertThat(response.reason()).isEqualTo("Flu");
        assertThat(response.status()).isEqualTo(LeaveStatus.APPROVED);
    }

    @Test
    void update_keepsExistingStatusWhenNotProvided() {
        when(repository.findById(1L)).thenReturn(Optional.of(existing(1L)));
        when(repository.save(any(LeaveRequest.class))).thenAnswer(inv -> inv.getArgument(0));

        LeaveResponse response = service.update(1L, dto(TODAY.plusDays(1), TODAY.plusDays(2), null));

        assertThat(response.status()).isEqualTo(LeaveStatus.PENDING);
    }

    @Test
    void update_throwsWhenMissing() {
        when(repository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.update(5L, dto(TODAY.plusDays(1), TODAY.plusDays(2), null)))
                .isInstanceOf(LeaveNotFoundException.class);
        verify(repository, never()).save(any());
    }

    @Test
    void update_rejectsInvalidDates() {
        when(repository.findById(1L)).thenReturn(Optional.of(existing(1L)));

        assertThatThrownBy(() -> service.update(1L, dto(TODAY.plusDays(5), TODAY.plusDays(1), null)))
                .isInstanceOf(InvalidLeaveRequestException.class);
        verify(repository, never()).save(any());
    }

    @Test
    void delete_removesExistingRequest() {
        when(repository.deleteById(1L)).thenReturn(true);

        service.delete(1L);

        verify(repository).deleteById(1L);
    }

    @Test
    void delete_throwsWhenMissing() {
        when(repository.deleteById(42L)).thenReturn(false);

        assertThatThrownBy(() -> service.delete(42L))
                .isInstanceOf(LeaveNotFoundException.class);
    }
}
