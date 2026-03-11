package com.schoolSys.schooolSys.niveau;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "classes", uniqueConstraints = @UniqueConstraint(columnNames = {"niveau_id", "letter"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "niveau_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Niveau niveau;

    @Column(nullable = false, length = 5)
    private String letter;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
