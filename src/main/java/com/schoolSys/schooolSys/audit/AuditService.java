package com.schoolSys.schooolSys.audit;

import com.schoolSys.schooolSys.audit.dto.AuditLogResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public List<AuditLogResponseDTO> getAll() {
        return auditLogRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponseDTO> filter(Long userId, String action, String entityType) {
        return auditLogRepository.findByFilters(userId, action, entityType).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponseDTO> getByDateRange(LocalDate from, LocalDate to) {
        LocalDateTime fromDateTime = from.atStartOfDay();
        LocalDateTime toDateTime = to.plusDays(1).atStartOfDay();
        return auditLogRepository.findByDateRange(fromDateTime, toDateTime).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<AuditLogResponseDTO> getByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityId(entityType, entityId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void logAction(Long userId, String action, String entityType, Long entityId,
                          String oldValue, String newValue, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .userId(userId)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .oldValue(oldValue)
                .newValue(newValue)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(log);
    }

    private AuditLogResponseDTO toDto(AuditLog a) {
        return AuditLogResponseDTO.builder()
                .id(a.getId())
                .userId(a.getUserId())
                .action(a.getAction())
                .entityType(a.getEntityType())
                .entityId(a.getEntityId())
                .oldValue(a.getOldValue())
                .newValue(a.getNewValue())
                .ipAddress(a.getIpAddress())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
