package com.schoolSys.schooolSys.enrollment.dto;

import com.schoolSys.schooolSys.enrollment.Enrollment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO returned when reading enrollment information.
 */
@Data
@Builder
public class EnrollmentResponseDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseName;
    private LocalDate enrollmentDate;
    private Enrollment.EnrollmentStatus status;
}
