package com.schoolSys.schooolSys.discipline;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "incident_eleves")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentEleve {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Incident incident;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @Column(length = 20)
    private String roleEleve; // AUTEUR, VICTIME, TEMOIN
}
