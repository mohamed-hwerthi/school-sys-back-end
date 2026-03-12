package com.schoolSys.schooolSys.absence;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "justificatifs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Justificatif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "absence_id", nullable = false)
    private Absence absence;

    @Column(name = "fichier_url")
    private String fichierUrl;

    @Column(name = "date_soumission", nullable = false)
    @Builder.Default
    private LocalDateTime dateSoumission = LocalDateTime.now();

    private Boolean valide;
}
