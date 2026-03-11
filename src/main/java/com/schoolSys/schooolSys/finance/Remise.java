package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.student.Student;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "remises")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Remise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_frais_id")
    private TypeFrais typeFrais;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TypeRemise type;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valeur;

    @Column(name = "est_pourcentage", nullable = false)
    @Builder.Default
    private Boolean estPourcentage = false;

    @Column(length = 255)
    private String motif;

    @Column(name = "annee_scolaire", nullable = false, length = 9)
    private String anneeScolaire;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum TypeRemise {
        FRATRIE, BOURSE, PERSONNEL, ANTICIPATION, COMMERCIAL
    }
}
