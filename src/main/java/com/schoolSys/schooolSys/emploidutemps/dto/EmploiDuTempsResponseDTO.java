package com.schoolSys.schooolSys.emploidutemps.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmploiDuTempsResponseDTO {
    private Long id;
    private Long classeId;
    private Long creneauId;
    private Integer jourSemaine;
    private Long moduleId;
    private Long enseignantId;
    private String salle;
    private Long classroomId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
