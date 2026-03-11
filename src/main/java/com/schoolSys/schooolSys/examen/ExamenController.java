package com.schoolSys.schooolSys.examen;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.examen.dto.ExamenRequestDTO;
import com.schoolSys.schooolSys.examen.dto.ExamenResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examens")
@RequiredArgsConstructor
public class ExamenController {

    private final ExamenService examenService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExamenResponseDTO>>> getAll(
            @RequestParam(required = false) Long moduleId,
            @RequestParam(required = false) Long classeId) {
        return ResponseEntity.ok(ApiResponse.ok(examenService.findAll(moduleId, classeId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExamenResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(examenService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExamenResponseDTO>> create(
            @Valid @RequestBody ExamenRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(examenService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ExamenResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody ExamenRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(examenService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        examenService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/bulk")
    public ResponseEntity<Void> deleteBulk(@RequestBody List<Long> ids) {
        examenService.deleteBulk(ids);
        return ResponseEntity.noContent().build();
    }
}
