package com.schoolSys.schooolSys.absence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeuilleJourDTO {
    private Long classeId;
    private String classeLabel;
    private String niveauName;
    private LocalDate date;
    private int totalEleves;
    private int absences;
    private int retards;
    private int justifiees;
}
