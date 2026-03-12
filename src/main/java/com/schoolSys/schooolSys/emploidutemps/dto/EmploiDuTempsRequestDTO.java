package com.schoolSys.schooolSys.emploidutemps.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmploiDuTempsRequestDTO {
    @NotNull
    private Long creneauId;
    @NotNull
    private Integer jourSemaine;
    private Long moduleId;
    private Long enseignantId;
    private String salle;
}
