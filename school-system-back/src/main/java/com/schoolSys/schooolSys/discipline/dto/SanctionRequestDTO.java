package com.schoolSys.schooolSys.discipline.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SanctionRequestDTO {
    @NotNull
    private Long eleveId;
    private Long incidentId;
    @NotBlank
    private String type;
    private String description;
    @NotNull
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private Long decideParId;
    private Boolean notifieParents;
    private Integer niveau;
    private String statut;
}
