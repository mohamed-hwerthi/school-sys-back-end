package com.schoolSys.schooolSys.analytics.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class KpiConfigResponseDTO {

    private Long id;
    private String nom;
    private String description;
    private String type;
    private BigDecimal valeurCible;
    private BigDecimal seuilAlerte;
    private Boolean actif;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
