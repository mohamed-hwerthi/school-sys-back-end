package com.schoolSys.schooolSys.cantine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbonnementCantineDTO {
    private Long id;
    private Long eleveId;
    private String typeAbonnement;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private BigDecimal montant;
    private Boolean actif;
    private String allergies;
    private String regime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
