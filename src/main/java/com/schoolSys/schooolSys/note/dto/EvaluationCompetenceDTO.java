package com.schoolSys.schooolSys.note.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class EvaluationCompetenceDTO {
    private Long id;
    private Long eleveId;
    private Long competenceId;
    private String competenceLabel;
    private Long examenId;
    private String niveau; // NON_ATTEINT, EN_COURS, ATTEINT, DEPASSE
    private String commentaire;
}
