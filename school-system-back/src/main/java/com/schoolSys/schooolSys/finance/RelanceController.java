package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.finance.dto.RelanceRequestDTO;
import com.schoolSys.schooolSys.finance.dto.RelanceResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/relances")
@RequiredArgsConstructor
public class RelanceController {

    private final RelanceService relanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RelanceResponseDTO>>> getAll(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(relanceService.findByAnneeScolaire(anneeScolaire)));
    }

    @GetMapping("/eleve/{studentId}")
    public ResponseEntity<ApiResponse<List<RelanceResponseDTO>>> getByStudent(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(relanceService.findByStudent(studentId, anneeScolaire)));
    }

    @GetMapping("/en-attente")
    public ResponseEntity<ApiResponse<List<RelanceResponseDTO>>> getPending(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(relanceService.findPending(anneeScolaire)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<RelanceService.RelanceStatsDTO>> getStats(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(relanceService.getStats(anneeScolaire)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RelanceResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(relanceService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RelanceResponseDTO>> create(
            @Valid @RequestBody RelanceRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(relanceService.create(dto)));
    }

    @PostMapping("/generer")
    public ResponseEntity<ApiResponse<List<RelanceResponseDTO>>> generate(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire,
            @RequestParam(defaultValue = "EMAIL") Relance.TypeRelance type) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(relanceService.generateRelances(anneeScolaire, type)));
    }

    @PatchMapping("/{id}/envoyee")
    public ResponseEntity<ApiResponse<RelanceResponseDTO>> markEnvoyee(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(relanceService.markAsEnvoyee(id)));
    }

    @PatchMapping("/{id}/echouee")
    public ResponseEntity<ApiResponse<RelanceResponseDTO>> markEchouee(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(relanceService.markAsEchouee(id)));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        relanceService.delete(id);
    }
}
