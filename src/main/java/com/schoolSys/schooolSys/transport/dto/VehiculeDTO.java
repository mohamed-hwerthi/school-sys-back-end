package com.schoolSys.schooolSys.transport.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehiculeDTO {
    private Long id;
    private String immatriculation;
    private String marque;
    private String modele;
    private Integer capacite;
    private String chauffeurNom;
    private String chauffeurTelephone;
    private LocalDate dateAssurance;
    private LocalDate dateControleTechnique;
    private String statut;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
