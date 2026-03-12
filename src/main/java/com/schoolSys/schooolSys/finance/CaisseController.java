package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.finance.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caisse")
@RequiredArgsConstructor
public class CaisseController {

    private final CaisseService caisseService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_FINANCE')")
    public ResponseEntity<ApiResponse<List<CaisseResponseDTO>>> getAll(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(caisseService.findAll(anneeScolaire)));
    }

    @GetMapping("/ouverte")
    @PreAuthorize("hasAuthority('READ_FINANCE')")
    public ResponseEntity<ApiResponse<CaisseResponseDTO>> getOuverte(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(caisseService.findOuverte(anneeScolaire)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_FINANCE')")
    public ResponseEntity<ApiResponse<CaisseResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(caisseService.findById(id)));
    }

    @PostMapping("/ouvrir")
    @PreAuthorize("hasAuthority('WRITE_FINANCE')")
    public ResponseEntity<ApiResponse<CaisseResponseDTO>> ouvrir(
            @Valid @RequestBody CaisseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(caisseService.ouvrir(dto)));
    }

    @PatchMapping("/{id}/fermer")
    @PreAuthorize("hasAuthority('WRITE_FINANCE')")
    public ResponseEntity<ApiResponse<CaisseResponseDTO>> fermer(
            @PathVariable Long id,
            @RequestParam(required = false) String fermePar) {
        return ResponseEntity.ok(ApiResponse.ok(caisseService.fermer(id, fermePar)));
    }

    // ── Mouvements ──

    @GetMapping("/{caisseId}/mouvements")
    @PreAuthorize("hasAuthority('READ_FINANCE')")
    public ResponseEntity<ApiResponse<List<MouvementCaisseResponseDTO>>> getMouvements(
            @PathVariable Long caisseId) {
        return ResponseEntity.ok(ApiResponse.ok(caisseService.findMouvements(caisseId)));
    }

    @PostMapping("/mouvements")
    @PreAuthorize("hasAuthority('WRITE_FINANCE')")
    public ResponseEntity<ApiResponse<MouvementCaisseResponseDTO>> addMouvement(
            @Valid @RequestBody MouvementCaisseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(caisseService.addMouvement(dto)));
    }

    @DeleteMapping("/mouvements/{mouvementId}")
    @PreAuthorize("hasAuthority('WRITE_FINANCE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMouvement(@PathVariable Long mouvementId) {
        caisseService.deleteMouvement(mouvementId);
    }
}
