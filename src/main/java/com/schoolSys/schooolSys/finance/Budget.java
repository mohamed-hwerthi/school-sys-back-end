package com.schoolSys.schooolSys.finance;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "budgets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "annee_scolaire", nullable = false)
    private String anneeScolaire;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false, length = 20)
    private String type; // RECETTE, DEPENSE

    private String categorie;

    @Column(name = "montant_prevu")
    @Builder.Default
    private BigDecimal montantPrevu = BigDecimal.ZERO;

    @Column(name = "montant_realise")
    @Builder.Default
    private BigDecimal montantRealise = BigDecimal.ZERO;

    private Integer mois;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
