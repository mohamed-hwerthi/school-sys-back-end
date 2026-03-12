package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.student.Student;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bourses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @ToString.Exclude
    private Student student;

    @Column(nullable = false, length = 50)
    private String type; // BOURSE, AIDE, EXONERATION

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private BigDecimal montant;

    private BigDecimal pourcentage;

    @Column(name = "annee_scolaire", nullable = false)
    private String anneeScolaire;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String statut = "ACTIVE"; // ACTIVE, SUSPENDUE, TERMINEE

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin")
    private LocalDate dateFin;

    private String motif;

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
