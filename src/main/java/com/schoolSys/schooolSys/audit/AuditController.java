package com.schoolSys.schooolSys.audit;

import com.schoolSys.schooolSys.audit.dto.AuditLogResponseDTO;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('READ_AUDIT')")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditLogResponseDTO>>> getAuditLogs(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType) {
        List<AuditLogResponseDTO> result;
        if (userId != null || action != null || entityType != null) {
            result = auditService.filter(userId, action, entityType);
        } else {
            result = auditService.getAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/date-range")
    public ResponseEntity<ApiResponse<List<AuditLogResponseDTO>>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getByDateRange(from, to)));
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    public ResponseEntity<ApiResponse<List<AuditLogResponseDTO>>> getByEntity(
            @PathVariable String entityType, @PathVariable Long entityId) {
        return ResponseEntity.ok(ApiResponse.ok(auditService.getByEntity(entityType, entityId)));
    }
}
