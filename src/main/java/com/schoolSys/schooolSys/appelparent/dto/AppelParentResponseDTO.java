package com.schoolSys.schooolSys.appelparent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppelParentResponseDTO {

    private Long id;
    private Long eleveId;
    private String appelePar;
    private String telephone;
    private String motif;
    private String notes;
    private LocalDateTime dateAppel;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
