package com.schoolSys.schooolSys.module;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.module.dto.ModuleRequestDTO;
import com.schoolSys.schooolSys.module.dto.ModuleResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
@RequiredArgsConstructor
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ModuleResponseDTO>>> getAll(
            @RequestParam(required = false) Long niveauId) {
        return ResponseEntity.ok(ApiResponse.ok(moduleService.findAll(niveauId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ModuleResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(moduleService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ModuleResponseDTO>> create(
            @Valid @RequestBody ModuleRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(moduleService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ModuleResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody ModuleRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(moduleService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        moduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
