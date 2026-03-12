package com.schoolSys.schooolSys.discipline;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sanctions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sanction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Incident incident;

    @Column(nullable = false, length = 50)
    private String type; // AVERTISSEMENT, BLAME, EXCLUSION_TEMPORAIRE, EXCLUSION_DEFINITIVE, TRAVAIL_SUPPLEMENTAIRE

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(name = "decide_par_id")
    private Long decideParId;

    @Column(name = "notifie_parents")
    @Builder.Default
    private Boolean notifieParents = false;

    @Column(name = "niveau")
    @Builder.Default
    private Integer niveau = 1; // 1=AVERTISSEMENT, 2=BLAME, 3=EXCLUSION_TEMPORAIRE, 4=EXCLUSION_DEFINITIVE

    @Column(name = "statut", length = 30)
    @Builder.Default
    private String statut = "ACTIVE"; // ACTIVE, LEVEE, EXPIREE

    @Column(name = "approuve_par")
    private Long approuvePar;

    @Column(name = "commentaire_approbation", columnDefinition = "TEXT")
    private String commentaireApprobation;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
