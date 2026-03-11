package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.finance.dto.PenaliteRequestDTO;
import com.schoolSys.schooolSys.finance.dto.PenaliteResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/penalites")
@RequiredArgsConstructor
public class PenaliteController {

    private final PenaliteService penaliteService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PenaliteResponseDTO>>> getAll(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(penaliteService.findByAnneeScolaire(anneeScolaire)));
    }

    @GetMapping("/eleve/{studentId}")
    public ResponseEntity<ApiResponse<List<PenaliteResponseDTO>>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(penaliteService.findByStudentId(studentId, anneeScolaire)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PenaliteResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(penaliteService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PenaliteResponseDTO>> create(
            @Valid @RequestBody PenaliteRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(penaliteService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PenaliteResponseDTO>> update(
            @PathVariable Long id, @Valid @RequestBody PenaliteRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(penaliteService.update(id, dto)));
    }

    @PatchMapping("/{id}/toggle-payee")
    public ResponseEntity<ApiResponse<PenaliteResponseDTO>> togglePayee(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(penaliteService.togglePayee(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        penaliteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
