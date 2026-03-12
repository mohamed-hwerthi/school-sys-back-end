package com.schoolSys.schooolSys.devoir;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "devoirs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Devoir {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "module_id")
    private Long moduleId;

    @Column(name = "classe_id")
    private Long classeId;

    @Column(name = "enseignant_id")
    private Long enseignantId;

    @Column(name = "date_publication", nullable = false)
    @Builder.Default
    private LocalDate datePublication = LocalDate.now();

    @Column(name = "date_limite", nullable = false)
    private LocalDate dateLimite;

    @Column(length = 20)
    @Builder.Default
    private String type = "DEVOIR";

    @Column(name = "points_max")
    @Builder.Default
    private Integer pointsMax = 20;

    @Column(name = "fichier_url", length = 500)
    private String fichierUrl;

    @Column(length = 20)
    @Builder.Default
    private String statut = "PUBLIE";

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
