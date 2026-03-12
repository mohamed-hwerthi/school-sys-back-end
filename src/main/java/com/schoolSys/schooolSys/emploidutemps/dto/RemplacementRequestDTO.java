package com.schoolSys.schooolSys.emploidutemps.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RemplacementRequestDTO {
    @NotNull private Long emploiDuTempsId;
    @NotNull private Long enseignantRemplacantId;
    @NotNull private LocalDate dateDebut;
    @NotNull private LocalDate dateFin;
    private String motif;
}
