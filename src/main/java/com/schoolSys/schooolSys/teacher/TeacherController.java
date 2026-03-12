package com.schoolSys.schooolSys.teacher;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.teacher.dto.TeacherRequestDTO;
import com.schoolSys.schooolSys.teacher.dto.TeacherResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService teacherService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_TEACHERS')")
    public ResponseEntity<ApiResponse<List<TeacherResponseDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.findAll()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_TEACHERS')")
    public ResponseEntity<ApiResponse<TeacherResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WRITE_TEACHERS')")
    public ResponseEntity<ApiResponse<TeacherResponseDTO>> create(
            @Valid @RequestBody TeacherRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(teacherService.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_TEACHERS')")
    public ResponseEntity<ApiResponse<TeacherResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody TeacherRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(teacherService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_TEACHERS')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        teacherService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    @PreAuthorize("hasAuthority('WRITE_TEACHERS')")
    public ResponseEntity<ApiResponse<List<TeacherResponseDTO>>> importBulk(
            @RequestBody List<@Valid TeacherRequestDTO> dtos) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(teacherService.importBulk(dtos)));
    }
}
