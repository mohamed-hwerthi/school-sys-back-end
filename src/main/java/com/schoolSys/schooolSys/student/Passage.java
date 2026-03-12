package com.schoolSys.schooolSys.student;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "passages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Passage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "ancien_niveau", length = 100)
    private String ancienNiveau;

    @Column(name = "nouveau_niveau", length = 100)
    private String nouveauNiveau;

    @Column(name = "ancienne_classe", length = 50)
    private String ancienneClasse;

    @Column(name = "nouvelle_classe", length = 50)
    private String nouvelleClasse;

    @Column(nullable = false, length = 20)
    private String decision;

    @Column(name = "annee_scolaire", nullable = false, length = 20)
    private String anneeScolaire;

    @Column(columnDefinition = "TEXT")
    private String motif;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    private void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
