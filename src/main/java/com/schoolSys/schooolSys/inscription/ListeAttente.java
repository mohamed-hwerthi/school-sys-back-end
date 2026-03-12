package com.schoolSys.schooolSys.inscription;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "liste_attente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListeAttente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inscription_id", nullable = false)
    private Long inscriptionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inscription_id", insertable = false, updatable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Inscription inscription;

    @Column(name = "niveau_id", nullable = false)
    private Long niveauId;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "annee_scolaire", nullable = false, length = 20)
    private String anneeScolaire;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
