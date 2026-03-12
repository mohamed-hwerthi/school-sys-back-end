package com.schoolSys.schooolSys.emploidutemps;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "emploi_du_temps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmploiDuTemps {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "classe_id", nullable = false)
    private Long classeId;

    @Column(name = "creneau_id", nullable = false)
    private Long creneauId;

    @Column(name = "jour_semaine", nullable = false)
    private Integer jourSemaine; // 1=Monday ... 7=Sunday

    @Column(name = "module_id")
    private Long moduleId;

    @Column(name = "enseignant_id")
    private Long enseignantId;

    @Column(length = 100)
    private String salle;

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
