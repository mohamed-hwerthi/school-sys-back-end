package com.schoolSys.schooolSys.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {

    private Long id;
    private String deviceName;
    private String ipAddress;
    private LocalDateTime lastUsedAt;
    private LocalDateTime createdAt;
    private boolean current;
}
