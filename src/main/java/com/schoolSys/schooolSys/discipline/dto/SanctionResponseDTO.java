package com.schoolSys.schooolSys.discipline.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SanctionResponseDTO {
    private Long id;
    private Long eleveId;
    private Long incidentId;
    private String type;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Long decideParId;
    private Boolean notifieParents;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
