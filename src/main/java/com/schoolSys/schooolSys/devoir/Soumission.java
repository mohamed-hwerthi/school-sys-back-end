package com.schoolSys.schooolSys.devoir;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "soumissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Soumission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "devoir_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Devoir devoir;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @Column(columnDefinition = "TEXT")
    private String contenu;

    @Column(name = "fichier_url", length = 500)
    private String fichierUrl;

    @Column(name = "date_soumission")
    @Builder.Default
    private LocalDateTime dateSoumission = LocalDateTime.now();

    @Column(precision = 5, scale = 2)
    private BigDecimal note;

    @Column(name = "commentaire_correction", columnDefinition = "TEXT")
    private String commentaireCorrection;

    @Column
    @Builder.Default
    private Boolean corrige = false;

    @Column(name = "en_retard")
    @Builder.Default
    private Boolean enRetard = false;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
