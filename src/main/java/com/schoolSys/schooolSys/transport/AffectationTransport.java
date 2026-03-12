package com.schoolSys.schooolSys.transport;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "affectations_transport")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AffectationTransport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "circuit_id", nullable = false)
    private Circuit circuit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "arret_id")
    private Arret arret;

    @Column(name = "annee_scolaire", nullable = false, length = 20)
    private String anneeScolaire;

    @Column
    @Builder.Default
    private Boolean actif = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
