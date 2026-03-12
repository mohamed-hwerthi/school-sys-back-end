package com.schoolSys.schooolSys.emploidutemps;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.emploidutemps.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EmploiDuTempsController {

    private final EmploiDuTempsService emploiDuTempsService;

    // --- Emploi du temps endpoints ---

    @GetMapping("/api/emploi-du-temps/classe/{classeId}")
    @PreAuthorize("hasAuthority('READ_EMPLOI_DU_TEMPS')")
    public ResponseEntity<ApiResponse<List<EmploiDuTempsResponseDTO>>> getByClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(ApiResponse.ok(emploiDuTempsService.getByClasse(classeId)));
    }

    @GetMapping("/api/emploi-du-temps/enseignant/{enseignantId}")
    @PreAuthorize("hasAuthority('READ_EMPLOI_DU_TEMPS')")
    public ResponseEntity<ApiResponse<List<EmploiDuTempsResponseDTO>>> getByEnseignant(@PathVariable Long enseignantId) {
        return ResponseEntity.ok(ApiResponse.ok(emploiDuTempsService.getByEnseignant(enseignantId)));
    }

    @PutMapping("/api/emploi-du-temps/classe/{classeId}")
    @PreAuthorize("hasAuthority('WRITE_EMPLOI_DU_TEMPS')")
    public ResponseEntity<ApiResponse<List<EmploiDuTempsResponseDTO>>> saveAll(
            @PathVariable Long classeId,
            @Valid @RequestBody List<EmploiDuTempsRequestDTO> requests) {
        return ResponseEntity.ok(ApiResponse.ok(emploiDuTempsService.saveAll(classeId, requests)));
    }

    @PostMapping("/api/emploi-du-temps/check-conflits")
    @PreAuthorize("hasAuthority('WRITE_EMPLOI_DU_TEMPS')")
    public ResponseEntity<ApiResponse<List<ConflitDTO>>> checkConflits(
            @Valid @RequestBody List<EmploiDuTempsRequestDTO> requests) {
        return ResponseEntity.ok(ApiResponse.ok(emploiDuTempsService.detectConflits(requests)));
    }

    // --- Creneau endpoints ---

    @GetMapping("/api/creneaux")
    @PreAuthorize("hasAuthority('READ_EMPLOI_DU_TEMPS')")
    public ResponseEntity<ApiResponse<List<CreneauDTO>>> getAllCreneaux() {
        return ResponseEntity.ok(ApiResponse.ok(emploiDuTempsService.getAllCreneaux()));
    }

    @PostMapping("/api/creneaux")
    @PreAuthorize("hasAuthority('WRITE_EMPLOI_DU_TEMPS')")
    public ResponseEntity<ApiResponse<CreneauDTO>> createCreneau(@Valid @RequestBody CreneauDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(emploiDuTempsService.createCreneau(dto)));
    }

    @DeleteMapping("/api/creneaux/{id}")
    @PreAuthorize("hasAuthority('WRITE_EMPLOI_DU_TEMPS')")
    public ResponseEntity<Void> deleteCreneau(@PathVariable Long id) {
        emploiDuTempsService.deleteCreneau(id);
        return ResponseEntity.noContent().build();
    }

    // --- Remplacements ---

    @PostMapping("/api/emploi-du-temps/remplacements")
    @PreAuthorize("hasAuthority('WRITE_EMPLOI_DU_TEMPS')")
    public ResponseEntity<ApiResponse<RemplacementResponseDTO>> createRemplacement(
            @Valid @RequestBody RemplacementRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(emploiDuTempsService.createRemplacement(dto)));
    }

    @GetMapping("/api/emploi-du-temps/remplacements")
    @PreAuthorize("hasAuthority('READ_EMPLOI_DU_TEMPS')")
    public ResponseEntity<ApiResponse<List<RemplacementResponseDTO>>> getRemplacements() {
        return ResponseEntity.ok(ApiResponse.ok(emploiDuTempsService.getAllRemplacements()));
    }

    @DeleteMapping("/api/emploi-du-temps/remplacements/{id}")
    @PreAuthorize("hasAuthority('WRITE_EMPLOI_DU_TEMPS')")
    public ResponseEntity<Void> deleteRemplacement(@PathVariable Long id) {
        emploiDuTempsService.deleteRemplacement(id);
        return ResponseEntity.noContent().build();
    }
}
