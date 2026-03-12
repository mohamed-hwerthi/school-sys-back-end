package com.schoolSys.schooolSys.transport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CircuitDTO {
    private Long id;
    private String nom;
    private String description;
    private Long vehiculeId;
    private String vehiculeImmatriculation;
    private LocalTime heureDepart;
    private LocalTime heureRetour;
    private BigDecimal distanceKm;
    private BigDecimal coutMensuel;
    private Boolean actif;
    private List<ArretDTO> arrets;
    private Long nbEleves;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
