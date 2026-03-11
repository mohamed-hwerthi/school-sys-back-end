package com.schoolSys.schooolSys.course;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.course.dto.CourseRequestDTO;
import com.schoolSys.schooolSys.course.dto.CourseResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for course CRUD operations.
 * <p>
 * Requires the {@code X-Tenant-ID} header to identify the school schema.
 * </p>
 */
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    /** Lists all courses in the current school. */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourseResponseDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(courseService.findAll()));
    }

    /** Gets a course by ID. */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.findById(id)));
    }

    /** Creates a new course. */
    @PostMapping
    public ResponseEntity<ApiResponse<CourseResponseDTO>> create(@RequestBody CourseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(courseService.create(dto)));
    }

    /** Updates an existing course. */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseResponseDTO>> update(@PathVariable Long id,
                                                                  @RequestBody CourseRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(courseService.update(id, dto)));
    }

    /** Deletes a course. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
