package com.schoolSys.schooolSys.note;

import com.schoolSys.schooolSys.examen.Examen;
import com.schoolSys.schooolSys.student.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notes", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "examen_id", "trimestre"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "examen_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Examen examen;

    @Column(nullable = false)
    private Integer trimestre;

    private Double valeur;

    @Column(columnDefinition = "TEXT")
    private String observation;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
