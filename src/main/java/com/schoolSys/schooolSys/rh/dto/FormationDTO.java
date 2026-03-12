package com.schoolSys.schooolSys.rh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormationDTO {
    private Long id;
    private String titre;
    private String description;
    private String formateur;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String lieu;
    private Integer nombreHeures;
    private BigDecimal cout;
    private String statut;
    private List<FormationParticipantDTO> participants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
