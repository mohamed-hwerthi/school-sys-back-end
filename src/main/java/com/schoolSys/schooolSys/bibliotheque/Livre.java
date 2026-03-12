package com.schoolSys.schooolSys.bibliotheque;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "livres")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Livre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String titre;

    @Column(length = 200)
    private String auteur;

    @Column(length = 20)
    private String isbn;

    @Column(length = 100)
    private String categorie;

    @Column(length = 200)
    private String editeur;

    @Column(name = "annee_publication")
    private Integer anneePublication;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "nombre_exemplaires")
    @Builder.Default
    private Integer nombreExemplaires = 1;

    @Column(name = "exemplaires_disponibles")
    @Builder.Default
    private Integer exemplairesDisponibles = 1;

    @Column(length = 100)
    private String emplacement;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

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
