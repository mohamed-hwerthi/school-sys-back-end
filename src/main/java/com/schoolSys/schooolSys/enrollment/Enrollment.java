package com.schoolSys.schooolSys.enrollment;

import com.schoolSys.schooolSys.course.Course;
import com.schoolSys.schooolSys.student.Student;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * JPA entity representing a student's enrollment in a course.
 */
@Entity
@Table(name = "enrollments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private LocalDate enrollmentDate;

    @Enumerated(EnumType.STRING)
    private EnrollmentStatus status;

    /** Tracks the lifecycle of an enrollment. */
    public enum EnrollmentStatus {
        ACTIVE, DROPPED, COMPLETED
    }
}
