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
    private String alertLevel; // NORMAL, JAUNE, ROUGE

    private java.util.List<EleveAlertDTO> elevesEnAlerte;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EleveAlertDTO {
        private Long eleveId;
        private String nom;
        private String prenom;
        private long absences;
        private String alertLevel;
    }
}
