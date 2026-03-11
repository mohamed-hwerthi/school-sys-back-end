package com.schoolSys.schooolSys.finance.dto;

import com.schoolSys.schooolSys.finance.Remise;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RemiseRequestDTO {

    @NotNull(message = "L'élève est requis")
    private Long studentId;

    private Long typeFraisId;

    @NotNull(message = "Le type est requis")
    private Remise.TypeRemise type;

    @NotNull(message = "La valeur est requise")
    @Positive(message = "La valeur doit être positive")
    private BigDecimal valeur;

    private Boolean estPourcentage;

    private String motif;

    private String anneeScolaire;

    private Boolean active;
}
