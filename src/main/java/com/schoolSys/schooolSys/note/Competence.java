package com.schoolSys.schooolSys.note;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "competences")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Competence {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "module_id")
    private Long moduleId;

    @Column(nullable = false)
    private String label;

    private String description;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
