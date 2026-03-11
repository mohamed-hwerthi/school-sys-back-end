package com.schoolSys.schooolSys.finance.dto;

import com.schoolSys.schooolSys.finance.TypeFrais;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TypeFraisResponseDTO {

    private Long id;
    private String nom;
    private BigDecimal montant;
    private TypeFrais.Frequence frequence;
    private String description;
    private Boolean actif;
    private LocalDateTime createdAt;
}
