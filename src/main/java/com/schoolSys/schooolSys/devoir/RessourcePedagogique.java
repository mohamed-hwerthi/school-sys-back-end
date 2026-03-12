package com.schoolSys.schooolSys.devoir;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "ressources_pedagogiques")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RessourcePedagogique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "module_id")
    private Long moduleId;

    @Column(length = 20)
    @Builder.Default
    private String type = "DOCUMENT";

    @Column(name = "fichier_url", length = 500)
    private String fichierUrl;

    @Column(name = "lien_externe", length = 500)
    private String lienExterne;

    @Column(name = "enseignant_id")
    private Long enseignantId;

    @Column(name = "taille_fichier")
    private Long tailleFichier;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
