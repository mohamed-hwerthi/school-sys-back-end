package com.schoolSys.schooolSys.absence.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbsenceStatsDTO {
    private Long classeId;
    private int mois;
    private int annee;
    private long totalAbsences;
    private long totalRetards;
    private long totalJustifiees;
    private long totalNonJustifiees;
    private double tauxAbsenteisme;
}
