package com.schoolSys.schooolSys.volumehoraire.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleClasseVolumeResponseDTO {

    private Long id;
    private Long moduleId;
    private Long classeId;
    private Long enseignantId;
    private Long anneeScolaireId;
    private Integer nbHeuresHebdo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
