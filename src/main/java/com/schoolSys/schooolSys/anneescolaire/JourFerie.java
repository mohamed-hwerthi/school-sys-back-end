package com.schoolSys.schooolSys.anneescolaire;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "jours_feries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JourFerie {

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

    @Column(nullable = false)
    private LocalDate date;
}
