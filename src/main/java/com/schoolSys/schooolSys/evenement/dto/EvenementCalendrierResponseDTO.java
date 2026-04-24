package com.schoolSys.schooolSys.evenement.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EvenementCalendrierResponseDTO {

    private Long id;
    private String titre;
    private String description;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String type;
    private String couleur;
    private String lieu;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
