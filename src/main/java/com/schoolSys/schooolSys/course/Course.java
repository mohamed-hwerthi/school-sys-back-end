package com.schoolSys.schooolSys.course;

import com.schoolSys.schooolSys.teacher.Teacher;
import jakarta.persistence.*;
import lombok.*;

/**
 * JPA entity representing a course offered by a school.
 * A course can optionally be assigned to a {@link Teacher}.
 */
@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;
}
