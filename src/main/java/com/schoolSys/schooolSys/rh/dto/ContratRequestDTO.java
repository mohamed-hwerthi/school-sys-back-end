package com.schoolSys.schooolSys.rh.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ContratRequestDTO {
    @NotNull
    private Long enseignantId;
    @NotNull
    private String typeContrat;
    @NotNull
    private LocalDate dateDebut;
    private LocalDate dateFin;
    @NotNull
    private BigDecimal salaire;
    private String statut;
    private String observations;
}
