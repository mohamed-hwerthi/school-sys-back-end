package com.schoolSys.schooolSys.finance.dto;

import com.schoolSys.schooolSys.finance.Paiement;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PaiementResponseDTO {

    private Long id;
    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private Long typeFraisId;
    private String typeFraisNom;
    private String mois;
    private String anneeScolaire;
    private BigDecimal montantDu;
    private BigDecimal montantPaye;
    private LocalDate datePaiement;
    private Paiement.ModePaiement modePaiement;
    private Paiement.StatutPaiement statut;
    private String reference;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
