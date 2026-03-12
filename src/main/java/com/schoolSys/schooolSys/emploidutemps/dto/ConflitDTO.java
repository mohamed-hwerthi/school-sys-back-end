package com.schoolSys.schooolSys.emploidutemps.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConflitDTO {
    private String typeConflit; // ENSEIGNANT, SALLE
    private Integer jourSemaine;
    private Long creneauId;
    private Long enseignantId;
    private String salle;
    private String message;
}
