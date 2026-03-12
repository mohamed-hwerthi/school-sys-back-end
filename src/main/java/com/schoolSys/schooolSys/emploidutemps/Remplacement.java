package com.schoolSys.schooolSys.emploidutemps;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "remplacements")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Remplacement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "emploi_du_temps_id", nullable = false)
    private Long emploiDuTempsId;

    @Column(name = "enseignant_remplacant_id", nullable = false)
    private Long enseignantRemplacantId;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;

    private String motif;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
