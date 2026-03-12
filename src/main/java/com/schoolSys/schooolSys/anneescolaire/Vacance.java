package com.schoolSys.schooolSys.anneescolaire;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "vacances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vacance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "annee_scolaire_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private AnneeScolaire anneeScolaire;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin", nullable = false)
    private LocalDate dateFin;
}
