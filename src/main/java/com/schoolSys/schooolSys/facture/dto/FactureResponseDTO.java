package com.schoolSys.schooolSys.facture.dto;

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
public class FactureResponseDTO {
    private Long id;
    private String numero;
    private Long studentId;
    private String studentNom;
    private LocalDate dateEmission;
    private LocalDate dateEcheance;
    private BigDecimal montantTotal;
    private BigDecimal montantPaye;
    private String statut;
    private String notes;
    private List<FactureLigneDTO> lignes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
