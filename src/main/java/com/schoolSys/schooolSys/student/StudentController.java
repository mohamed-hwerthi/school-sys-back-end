package com.schoolSys.schooolSys.student;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.common.dto.PagedResponse;
import com.schoolSys.schooolSys.student.dto.StudentRequestDTO;
import com.schoolSys.schooolSys.student.dto.StudentResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    /**
     * Paginated + filtered list.
     * GET /api/students?page=0&size=20&search=ben&niveau=3ème année&classe=3A&status=Actif&sex=M&blocked=false&sort=lastName,asc
     */
    @GetMapping
    @PreAuthorize("hasAuthority('READ_STUDENTS')")
    public ResponseEntity<ApiResponse<PagedResponse<StudentResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String niveau,
            @RequestParam(required = false) String classe,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String sex,
            @RequestParam(required = false) Boolean blocked,
            @RequestParam(defaultValue = "lastName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PagedResponse<StudentResponseDTO> result = studentService.findAll(
                search, niveau, classe, status, sex, blocked, pageable
        );
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_STUDENTS')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WRITE_STUDENTS')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> create(@Valid @RequestBody StudentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(studentService.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_STUDENTS')")
    public ResponseEntity<ApiResponse<StudentResponseDTO>> update(@PathVariable Long id,
                                                                   @Valid @RequestBody StudentRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(studentService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('DELETE_STUDENTS')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    @PreAuthorize("hasAuthority('WRITE_STUDENTS')")
    public ResponseEntity<ApiResponse<List<StudentResponseDTO>>> importBulk(
            @Valid @RequestBody List<StudentRequestDTO> dtos) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(studentService.importBulk(dtos)));
    }
}
