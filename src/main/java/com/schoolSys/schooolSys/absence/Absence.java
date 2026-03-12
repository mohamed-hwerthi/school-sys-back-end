package com.schoolSys.schooolSys.absence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "absences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Absence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 20)
    private String type; // ABSENCE or RETARD

    @Column(length = 50)
    private String seance;

    @Column(name = "heure_arrivee")
    private LocalTime heureArrivee;

    @Column(nullable = false)
    @Builder.Default
    private Boolean justifie = false;

    @Column(columnDefinition = "TEXT")
    private String motif;

    @Column(name = "enseignant_id")
    private Long enseignantId;

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
