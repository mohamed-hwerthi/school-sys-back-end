package com.schoolSys.schooolSys.circulaire;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "circulaires")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Circulaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titre;

    @Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    @Column(name = "date_creation", nullable = false)
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "date_publication")
    private LocalDateTime datePublication;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String statut = "Brouillon";

    @Column(nullable = false, length = 255)
    private String auteur;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String cible = "Tous";

    @Column(name = "piece_jointe", length = 500)
    private String pieceJointe;

    @Column
    @Builder.Default
    private Boolean important = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
