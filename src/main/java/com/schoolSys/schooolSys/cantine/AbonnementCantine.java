package com.schoolSys.schooolSys.cantine;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "abonnements_cantine")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbonnementCantine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @Column(name = "type_abonnement", nullable = false, length = 20)
    private String typeAbonnement;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal montant;

    @Column
    @Builder.Default
    private Boolean actif = true;

    @Column(columnDefinition = "TEXT")
    private String allergies;

    @Column(length = 20)
    @Builder.Default
    private String regime = "STANDARD";

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
