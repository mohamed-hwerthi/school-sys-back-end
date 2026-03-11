package com.schoolSys.schooolSys.enrollment.dto;

import com.schoolSys.schooolSys.enrollment.Enrollment;
import lombok.Data;

import java.time.LocalDate;

/**
 * DTO for creating or updating an enrollment.
 */
@Data
public class EnrollmentRequestDTO {
    private Long studentId;
    private Long courseId;
    private LocalDate enrollmentDate;
    private Enrollment.EnrollmentStatus status;
}
