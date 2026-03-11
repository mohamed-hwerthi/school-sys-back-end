package com.schoolSys.schooolSys.teacher;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String email;

    private String specialization;

    private String sexe;

    private String telephone;

    private LocalDate dateNaissance;

    @Column(columnDefinition = "DATE DEFAULT CURRENT_DATE")
    private LocalDate dateEmbauche;

    @Column(nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'Actif'")
    private String statut;

    @PrePersist
    private void prePersist() {
        if (dateEmbauche == null) dateEmbauche = LocalDate.now();
        if (statut == null) statut = "Actif";
    }
}
