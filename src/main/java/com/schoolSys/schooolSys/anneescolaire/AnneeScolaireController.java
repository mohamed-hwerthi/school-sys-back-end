package com.schoolSys.schooolSys.anneescolaire;

import com.schoolSys.schooolSys.anneescolaire.dto.*;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/annees-scolaires")
@RequiredArgsConstructor
public class AnneeScolaireController {

    private final AnneeScolaireService anneeScolaireService;

    // --- AnneeScolaire endpoints ---

    @GetMapping
    public ResponseEntity<ApiResponse<List<AnneeScolaireResponseDTO>>> getAllAnnees() {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.getAllAnnees()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AnneeScolaireResponseDTO>> getAnneeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.getAnneeById(id)));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<AnneeScolaireResponseDTO>> getActiveAnnee() {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.getActiveAnnee()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AnneeScolaireResponseDTO>> createAnnee(
            @Valid @RequestBody AnneeScolaireRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(anneeScolaireService.createAnnee(request)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AnneeScolaireResponseDTO>> updateAnnee(
            @PathVariable Long id,
            @Valid @RequestBody AnneeScolaireRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.updateAnnee(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnee(@PathVariable Long id) {
        anneeScolaireService.deleteAnnee(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<AnneeScolaireResponseDTO>> activateAnnee(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.activateAnnee(id)));
    }

    @PutMapping("/{id}/cloturer")
    public ResponseEntity<ApiResponse<AnneeScolaireResponseDTO>> cloturerAnnee(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.cloturerAnnee(id)));
    }

    // --- Trimestre endpoints ---

    @PostMapping("/{anneeScolaireId}/trimestres")
    public ResponseEntity<ApiResponse<TrimestreDTO>> addTrimestre(
            @PathVariable Long anneeScolaireId,
            @Valid @RequestBody TrimestreDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(anneeScolaireService.addTrimestre(anneeScolaireId, dto)));
    }

    @PutMapping("/trimestres/{id}")
    public ResponseEntity<ApiResponse<TrimestreDTO>> updateTrimestre(
            @PathVariable Long id,
            @Valid @RequestBody TrimestreDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.updateTrimestre(id, dto)));
    }

    @DeleteMapping("/trimestres/{id}")
    public ResponseEntity<Void> deleteTrimestre(@PathVariable Long id) {
        anneeScolaireService.deleteTrimestre(id);
        return ResponseEntity.noContent().build();
    }

    // --- Vacance endpoints ---

    @PostMapping("/{anneeScolaireId}/vacances")
    public ResponseEntity<ApiResponse<VacanceDTO>> addVacance(
            @PathVariable Long anneeScolaireId,
            @Valid @RequestBody VacanceDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(anneeScolaireService.addVacance(anneeScolaireId, dto)));
    }

    @PutMapping("/vacances/{id}")
    public ResponseEntity<ApiResponse<VacanceDTO>> updateVacance(
            @PathVariable Long id,
            @Valid @RequestBody VacanceDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.updateVacance(id, dto)));
    }

    @DeleteMapping("/vacances/{id}")
    public ResponseEntity<Void> deleteVacance(@PathVariable Long id) {
        anneeScolaireService.deleteVacance(id);
        return ResponseEntity.noContent().build();
    }

    // --- JourFerie endpoints ---

    @PostMapping("/{anneeScolaireId}/jours-feries")
    public ResponseEntity<ApiResponse<JourFerieDTO>> addJourFerie(
            @PathVariable Long anneeScolaireId,
            @Valid @RequestBody JourFerieDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(anneeScolaireService.addJourFerie(anneeScolaireId, dto)));
    }

    @PutMapping("/jours-feries/{id}")
    public ResponseEntity<ApiResponse<JourFerieDTO>> updateJourFerie(
            @PathVariable Long id,
            @Valid @RequestBody JourFerieDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(anneeScolaireService.updateJourFerie(id, dto)));
    }

    @DeleteMapping("/jours-feries/{id}")
    public ResponseEntity<Void> deleteJourFerie(@PathVariable Long id) {
        anneeScolaireService.deleteJourFerie(id);
        return ResponseEntity.noContent().build();
    }
}
