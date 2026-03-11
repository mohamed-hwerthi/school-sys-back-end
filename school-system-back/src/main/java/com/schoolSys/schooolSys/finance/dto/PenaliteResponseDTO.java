package com.schoolSys.schooolSys.finance.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PenaliteResponseDTO {

    private Long id;
    private Long studentId;
    private String studentFirstName;
    private String studentLastName;
    private Long paiementId;
    private String paiementReference;
    private BigDecimal montant;
    private String motif;
    private LocalDate dateApplication;
    private String anneeScolaire;
    private Boolean payee;
    private LocalDateTime createdAt;
}
