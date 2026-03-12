package com.schoolSys.schooolSys.emploidutemps.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class RemplacementResponseDTO {
    private Long id;
    private Long emploiDuTempsId;
    private Long enseignantRemplacantId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String motif;
    private LocalDateTime createdAt;
}
