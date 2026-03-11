package com.schoolSys.schooolSys.course.dto;

import lombok.Builder;
import lombok.Data;

/**
 * DTO returned when reading course information.
 */
@Data
@Builder
public class CourseResponseDTO {
    private Long id;
    private String name;
    private String description;
    private String code;
    private Long teacherId;
    private String teacherName;
}
