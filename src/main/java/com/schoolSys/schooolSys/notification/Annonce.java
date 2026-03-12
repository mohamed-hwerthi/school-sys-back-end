package com.schoolSys.schooolSys.notification;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "annonces")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Annonce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titre;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contenu;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String type = "GENERAL";

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String destinataires = "TOUS";

    @Column(name = "classe_id")
    private Long classeId;

    @Column(name = "auteur_id")
    private Long auteurId;

    @Column(name = "auteur_name", length = 100)
    private String auteurName;

    @Column(name = "date_publication")
    @Builder.Default
    private LocalDateTime datePublication = LocalDateTime.now();

    @Column(name = "date_expiration")
    private LocalDateTime dateExpiration;

    @Column(nullable = false)
    @Builder.Default
    private Boolean actif = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
