package com.schoolSys.schooolSys.cantine;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pointages_repas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointageRepas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "eleve_id", nullable = false)
    private Long eleveId;

    @Column(name = "date_repas", nullable = false)
    @Builder.Default
    private LocalDate dateRepas = LocalDate.now();

    @Column(name = "type_repas", length = 20)
    @Builder.Default
    private String typeRepas = "DEJEUNER";

    @Column
    @Builder.Default
    private Boolean present = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
