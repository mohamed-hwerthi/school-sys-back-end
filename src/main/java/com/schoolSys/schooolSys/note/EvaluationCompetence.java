package com.schoolSys.schooolSys.note;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "evaluations_competences")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class EvaluationCompetence {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @Column(name = "competence_id", nullable = false)
    private Long competenceId;

    @Column(name = "examen_id", nullable = false)
    private Long examenId;

    @Column(nullable = false, length = 20)
    private String niveau; // NON_ATTEINT, EN_COURS, ATTEINT, DEPASSE

    private String commentaire;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
