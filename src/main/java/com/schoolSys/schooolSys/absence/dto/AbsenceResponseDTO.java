package com.schoolSys.schooolSys.absence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbsenceResponseDTO {
    private Long id;
    private Long eleveId;
    private LocalDate date;
    private String type;
    private String seance;
    private LocalTime heureArrivee;
    private Boolean justifie;
    private String motif;
    private Long enseignantId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
