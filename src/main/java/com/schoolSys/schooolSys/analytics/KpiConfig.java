package com.schoolSys.schooolSys.analytics;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "kpi_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KpiConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 20)
    private String type;

    @Column(name = "valeur_cible", precision = 10, scale = 2)
    private BigDecimal valeurCible;

    @Column(name = "seuil_alerte", precision = 10, scale = 2)
    private BigDecimal seuilAlerte;

    @Builder.Default
    @Column(nullable = false)
    private Boolean actif = true;

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
