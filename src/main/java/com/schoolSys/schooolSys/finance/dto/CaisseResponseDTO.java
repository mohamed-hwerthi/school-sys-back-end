package com.schoolSys.schooolSys.finance.dto;

import com.schoolSys.schooolSys.finance.Caisse;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CaisseResponseDTO {
    private Long id;
    private LocalDate dateOuverture;
    private LocalDate dateFermeture;
    private Caisse.StatutCaisse statut;
    private BigDecimal soldeOuverture;
    private BigDecimal soldeFermeture;
    private BigDecimal totalEntrees;
    private BigDecimal totalSorties;
    private BigDecimal soldeActuel;
    private String anneeScolaire;
    private String notes;
    private String ouvertPar;
    private String fermePar;
    private LocalDateTime createdAt;
}
