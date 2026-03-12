package com.schoolSys.schooolSys.devoir.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SoumissionDTO {

    private Long id;
    private Long devoirId;
    private String devoirTitre;
    private Long eleveId;
    private String contenu;
    private String fichierUrl;
    private LocalDateTime dateSoumission;
    private BigDecimal note;
    private String commentaireCorrection;
    private Boolean corrige;
    private Boolean enRetard;
    private LocalDateTime createdAt;
}
