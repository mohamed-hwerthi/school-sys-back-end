package com.schoolSys.schooolSys.rh;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "fiches_paie")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichePaie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "employe_id", nullable = false)
    private Long employeId;

    @Column(name = "employe_type", nullable = false, length = 20)
    private String employeType;

    @Column(nullable = false)
    private Integer mois;

    @Column(nullable = false)
    private Integer annee;

    @Column(name = "salaire_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal salaireBase;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal primes = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal retenues = BigDecimal.ZERO;

    @Column(name = "salaire_net", nullable = false, precision = 10, scale = 2)
    private BigDecimal salaireNet;

    @Column(name = "date_paiement")
    private LocalDate datePaiement;

    @Builder.Default
    private Boolean paye = false;

    @Column(columnDefinition = "TEXT")
    private String commentaire;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
