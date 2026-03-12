package com.schoolSys.schooolSys.vitrine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitrineAnnouncementDTO {

    private Long id;
    private String title;
    private String body;
    private boolean pinned;
    private boolean published;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
