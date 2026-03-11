package com.schoolSys.schooolSys.domaine;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.domaine.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/domaines")
@RequiredArgsConstructor
public class DomaineController {

    private final DomaineService domaineService;

    // ── Domaines ────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<ApiResponse<List<DomaineResponseDTO>>> getAll(
            @RequestParam(required = false) Long niveauId) {
        return ResponseEntity.ok(ApiResponse.ok(domaineService.findAll(niveauId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DomaineResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(domaineService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DomaineResponseDTO>> create(
            @Valid @RequestBody DomaineRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(domaineService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DomaineResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody DomaineRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(domaineService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        domaineService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Sous-domaines ───────────────────────────────────────

    @GetMapping("/{domaineId}/sous-domaines")
    public ResponseEntity<ApiResponse<List<SousDomaineDTO>>> getSousDomaines(
            @PathVariable Long domaineId) {
        return ResponseEntity.ok(ApiResponse.ok(domaineService.findSousDomaines(domaineId)));
    }

    @PostMapping("/sous-domaines")
    public ResponseEntity<ApiResponse<SousDomaineDTO>> createSousDomaine(
            @Valid @RequestBody SousDomaineRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(domaineService.createSousDomaine(dto)));
    }

    @PutMapping("/sous-domaines/{id}")
    public ResponseEntity<ApiResponse<SousDomaineDTO>> updateSousDomaine(
            @PathVariable Long id,
            @Valid @RequestBody SousDomaineRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(domaineService.updateSousDomaine(id, dto)));
    }

    @DeleteMapping("/sous-domaines/{id}")
    public ResponseEntity<Void> deleteSousDomaine(@PathVariable Long id) {
        domaineService.deleteSousDomaine(id);
        return ResponseEntity.noContent().build();
    }
}
