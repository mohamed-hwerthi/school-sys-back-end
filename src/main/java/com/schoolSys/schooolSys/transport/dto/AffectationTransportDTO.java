package com.schoolSys.schooolSys.transport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffectationTransportDTO {
    private Long id;
    private Long eleveId;
    private Long circuitId;
    private String circuitNom;
    private Long arretId;
    private String arretNom;
    private String anneeScolaire;
    private Boolean actif;
    private LocalDateTime createdAt;
}
