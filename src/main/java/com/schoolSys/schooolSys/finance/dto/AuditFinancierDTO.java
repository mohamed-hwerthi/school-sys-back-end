package com.schoolSys.schooolSys.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditFinancierDTO {

    private Long id;
    private String entityType;
    private Long entityId;
    private String action;
    private Long userId;
    private String userName;
    private String oldValues;
    private String newValues;
    private LocalDateTime createdAt;
}
