package com.schoolSys.schooolSys.rh.dto;

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
public class CongeResponseDTO {
    private Long id;
    private Long enseignantId;
    private String enseignantNom;
    private String typeConge;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String motif;
    private String statut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
