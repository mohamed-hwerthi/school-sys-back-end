package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.finance.dto.RemiseRequestDTO;
import com.schoolSys.schooolSys.finance.dto.RemiseResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/remises")
@RequiredArgsConstructor
public class RemiseController {

    private final RemiseService remiseService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_FINANCE')")
    public ResponseEntity<ApiResponse<List<RemiseResponseDTO>>> getAll(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(remiseService.findByAnneeScolaire(anneeScolaire)));
    }

    @GetMapping("/eleve/{studentId}")
    @PreAuthorize("hasAuthority('READ_FINANCE')")
    public ResponseEntity<ApiResponse<List<RemiseResponseDTO>>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(remiseService.findByStudentId(studentId, anneeScolaire)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_FINANCE')")
    public ResponseEntity<ApiResponse<RemiseResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(remiseService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WRITE_FINANCE')")
    public ResponseEntity<ApiResponse<RemiseResponseDTO>> create(
            @Valid @RequestBody RemiseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(remiseService.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_FINANCE')")
    public ResponseEntity<ApiResponse<RemiseResponseDTO>> update(
            @PathVariable Long id, @Valid @RequestBody RemiseRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(remiseService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_FINANCE')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        remiseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
