package com.schoolSys.schooolSys.devoir.dto;

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
public class DevoirDTO {

    private Long id;
    private String titre;
    private String description;
    private Long moduleId;
    private Long classeId;
    private Long enseignantId;
    private LocalDate datePublication;
    private LocalDate dateLimite;
    private String type;
    private Integer pointsMax;
    private String fichierUrl;
    private String statut;
    private long totalSoumissions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
