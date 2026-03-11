package com.schoolSys.schooolSys.appreciation;

import com.schoolSys.schooolSys.student.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "observations_trimestre",
        uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "trimestre"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ObservationTrimestre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Student student;

    @Column(nullable = false)
    private Integer trimestre;

    @Column(columnDefinition = "TEXT")
    private String comportement;

    @Column(name = "certificat_type", length = 100)
    private String certificatType;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
