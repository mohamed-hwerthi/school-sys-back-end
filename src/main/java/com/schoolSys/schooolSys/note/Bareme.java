package com.schoolSys.schooolSys.note;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "baremes")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bareme {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(name = "note_max", nullable = false)
    @Builder.Default
    private BigDecimal noteMax = new BigDecimal("20.0");

    @Column(name = "note_min", nullable = false)
    @Builder.Default
    private BigDecimal noteMin = BigDecimal.ZERO;

    @Column(name = "note_passage", nullable = false)
    @Builder.Default
    private BigDecimal notePassage = new BigDecimal("10.0");

    @Builder.Default
    private Boolean actif = true;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
