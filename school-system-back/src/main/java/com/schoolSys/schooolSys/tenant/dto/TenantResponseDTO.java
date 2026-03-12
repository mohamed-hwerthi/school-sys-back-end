package com.schoolSys.schooolSys.tenant.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * DTO returned when reading tenant information.
 */
@Data
@Builder
public class TenantResponseDTO {

    private Long id;
    private String name;
    private String schemaName;
    private String slug;
    private String contactEmail;
    private boolean active;
    private LocalDateTime createdAt;
}
