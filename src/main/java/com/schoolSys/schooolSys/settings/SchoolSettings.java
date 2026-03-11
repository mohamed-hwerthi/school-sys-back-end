package com.schoolSys.schooolSys.settings;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "school_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SchoolSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "school_name", nullable = false)
    @Builder.Default
    private String schoolName = "École";

    @Column(name = "school_name_ar")
    private String schoolNameAr;

    @Column(name = "annee_scolaire", nullable = false)
    @Builder.Default
    private String anneeScolaire = "2025 / 2026";

    @Column(columnDefinition = "TEXT")
    private String adresse;

    @Column(length = 50)
    private String telephone;

    @Column(name = "directeur_name")
    private String directeurName;

    @Column(name = "directeur_name_ar")
    private String directeurNameAr;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
