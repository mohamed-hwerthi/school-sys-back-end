package com.schoolSys.schooolSys.bulletin;

import com.schoolSys.schooolSys.bulletin.dto.*;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bulletins")
@RequiredArgsConstructor
public class BulletinController {

    private final BulletinService bulletinService;

    @GetMapping
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<ApiResponse<List<BulletinDTO>>> getBulletins(
            @RequestParam Long classeId,
            @RequestParam Integer trimestre,
            @RequestParam(defaultValue = "etatique") String version) {
        return ResponseEntity.ok(ApiResponse.ok(
                bulletinService.getBulletins(classeId, trimestre, version)));
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasAuthority('READ_BULLETINS')")
    public ResponseEntity<ApiResponse<BulletinDTO>> getBulletin(
            @RequestParam Long classeId,
            @PathVariable Long studentId,
            @RequestParam Integer trimestre,
            @RequestParam(defaultValue = "etatique") String version) {
        return ResponseEntity.ok(ApiResponse.ok(
                bulletinService.getBulletin(classeId, studentId, trimestre, version)));
    }

    // --- ANN-040: Bulletin annuel ---

    @GetMapping("/annuel")
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<ApiResponse<List<BulletinAnnuelDTO>>> getBulletinsAnnuels(
            @RequestParam Long classeId,
            @RequestParam(defaultValue = "etatique") String version) {
        return ResponseEntity.ok(ApiResponse.ok(
                bulletinService.getBulletinsAnnuels(classeId, version)));
    }

    // --- BUL-003: Templates ---

    @GetMapping("/templates")
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<ApiResponse<List<BulletinTemplateDTO>>> getTemplates() {
        return ResponseEntity.ok(ApiResponse.ok(bulletinService.getAllTemplates()));
    }

    @GetMapping("/templates/{id}")
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<ApiResponse<BulletinTemplateDTO>> getTemplate(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(bulletinService.getTemplate(id)));
    }

    @GetMapping("/templates/active")
    @PreAuthorize("hasAuthority('READ_BULLETINS')")
    public ResponseEntity<ApiResponse<BulletinTemplateDTO>> getActiveTemplate() {
        return ResponseEntity.ok(ApiResponse.ok(bulletinService.getActiveTemplate()));
    }

    @PostMapping("/templates")
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<ApiResponse<BulletinTemplateDTO>> createTemplate(
            @Valid @RequestBody BulletinTemplateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(bulletinService.createTemplate(dto)));
    }

    @PutMapping("/templates/{id}")
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<ApiResponse<BulletinTemplateDTO>> updateTemplate(
            @PathVariable Long id, @Valid @RequestBody BulletinTemplateDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(bulletinService.updateTemplate(id, dto)));
    }

    @PutMapping("/templates/{id}/activate")
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<ApiResponse<BulletinTemplateDTO>> activateTemplate(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(bulletinService.activateTemplate(id)));
    }

    @DeleteMapping("/templates/{id}")
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        bulletinService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    // --- BUL-004: Mass generate ---

    @GetMapping("/classe/{classeId}/trimestre/{trimestre}/mass-generate")
    @PreAuthorize("hasAuthority('GENERATE_BULLETINS')")
    public ResponseEntity<ApiResponse<List<BulletinDTO>>> massGenerate(
            @PathVariable Long classeId, @PathVariable Integer trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(
                bulletinService.generateBulletinsForClasse(classeId, trimestre)));
    }

    // --- BUL-005: Stats reussite ---

    @GetMapping("/stats/classe/{classeId}/trimestre/{trimestre}")
    @PreAuthorize("hasAuthority('READ_BULLETINS')")
    public ResponseEntity<ApiResponse<StatsReussiteDTO>> getStatsReussite(
            @PathVariable Long classeId, @PathVariable Integer trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(
                bulletinService.getStatsReussite(classeId, trimestre)));
    }

    // --- BUL-006: Attestation ---

    @GetMapping("/attestation/{eleveId}")
    @PreAuthorize("hasAuthority('READ_BULLETINS')")
    public ResponseEntity<ApiResponse<AttestationDTO>> getAttestation(@PathVariable Long eleveId) {
        return ResponseEntity.ok(ApiResponse.ok(bulletinService.getAttestation(eleveId)));
    }

    // --- BUL-007: Comparatif ---

    @GetMapping("/comparatif")
    @PreAuthorize("hasAuthority('READ_BULLETINS')")
    public ResponseEntity<ApiResponse<ComparatifDTO>> getComparatifByNiveau(
            @RequestParam Long niveauId) {
        return ResponseEntity.ok(ApiResponse.ok(bulletinService.getComparatifByNiveau(niveauId)));
    }

    @GetMapping("/comparatif/evolution")
    @PreAuthorize("hasAuthority('READ_BULLETINS')")
    public ResponseEntity<ApiResponse<ComparatifDTO>> getComparatifEvolution(
            @RequestParam Long classeId) {
        return ResponseEntity.ok(ApiResponse.ok(bulletinService.getComparatifEvolution(classeId)));
    }
}
