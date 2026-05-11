package com.schoolSys.schooolSys.disponibilite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnseignantDisponibiliteResponseDTO {

    private Long id;
    private Long enseignantId;
    private Integer jourSemaine;
    private Long creneauId;
    private String type;
    private String motif;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
