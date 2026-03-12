package com.schoolSys.schooolSys.transport;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "arrets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Arret {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "circuit_id", nullable = false)
    private Circuit circuit;

    @Column(nullable = false, length = 200)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String adresse;

    @Column(nullable = false)
    private Integer ordre;

    @Column(name = "heure_passage")
    private LocalTime heurePassage;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;
}
