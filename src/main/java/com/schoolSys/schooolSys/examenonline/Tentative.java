package com.schoolSys.schooolSys.examenonline;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tentatives")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tentative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Quiz quiz;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @Column(name = "date_debut", nullable = false)
    @Builder.Default
    private LocalDateTime dateDebut = LocalDateTime.now();

    @Column(name = "date_fin")
    private LocalDateTime dateFin;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "score_pourcentage", precision = 5, scale = 2)
    private BigDecimal scorePourcentage;

    @Column(length = 20)
    @Builder.Default
    private String statut = "EN_COURS";

    @Column(name = "temps_passe_secondes")
    private Integer tempsPasseSecondes;

    @OneToMany(mappedBy = "tentative", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @Builder.Default
    private List<ReponseEleve> reponses = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
