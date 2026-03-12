package com.schoolSys.schooolSys.discipline;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.discipline.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/discipline")
@RequiredArgsConstructor
public class DisciplineController {

    private final DisciplineService disciplineService;

    // --- Incident endpoints ---

    @GetMapping("/incidents")
    public ResponseEntity<ApiResponse<List<IncidentResponseDTO>>> getAllIncidents() {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getAllIncidents()));
    }

    @GetMapping("/incidents/{id}")
    public ResponseEntity<ApiResponse<IncidentResponseDTO>> getIncidentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getIncidentById(id)));
    }

    @GetMapping("/incidents/date-range")
    public ResponseEntity<ApiResponse<List<IncidentResponseDTO>>> getIncidentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getIncidentsByDateRange(start, end)));
    }

    @GetMapping("/incidents/type/{type}")
    public ResponseEntity<ApiResponse<List<IncidentResponseDTO>>> getIncidentsByType(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getIncidentsByType(type)));
    }

    @GetMapping("/incidents/gravite/{gravite}")
    public ResponseEntity<ApiResponse<List<IncidentResponseDTO>>> getIncidentsByGravite(@PathVariable String gravite) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getIncidentsByGravite(gravite)));
    }

    @PostMapping("/incidents")
    public ResponseEntity<ApiResponse<IncidentResponseDTO>> createIncident(
            @Valid @RequestBody IncidentRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(disciplineService.createIncident(request)));
    }

    @PutMapping("/incidents/{id}")
    public ResponseEntity<ApiResponse<IncidentResponseDTO>> updateIncident(
            @PathVariable Long id,
            @Valid @RequestBody IncidentRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.updateIncident(id, request)));
    }

    @DeleteMapping("/incidents/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        disciplineService.deleteIncident(id);
        return ResponseEntity.noContent().build();
    }

    // --- Sanction endpoints ---

    @GetMapping("/sanctions")
    public ResponseEntity<ApiResponse<List<SanctionResponseDTO>>> getAllSanctions() {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getAllSanctions()));
    }

    @GetMapping("/sanctions/{id}")
    public ResponseEntity<ApiResponse<SanctionResponseDTO>> getSanctionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getSanctionById(id)));
    }

    @GetMapping("/sanctions/eleve/{eleveId}")
    public ResponseEntity<ApiResponse<List<SanctionResponseDTO>>> getSanctionsByEleve(@PathVariable Long eleveId) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getSanctionsByEleve(eleveId)));
    }

    @GetMapping("/sanctions/incident/{incidentId}")
    public ResponseEntity<ApiResponse<List<SanctionResponseDTO>>> getSanctionsByIncident(@PathVariable Long incidentId) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.getSanctionsByIncident(incidentId)));
    }

    @PostMapping("/sanctions")
    public ResponseEntity<ApiResponse<SanctionResponseDTO>> createSanction(
            @Valid @RequestBody SanctionRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(disciplineService.createSanction(request)));
    }

    @PutMapping("/sanctions/{id}")
    public ResponseEntity<ApiResponse<SanctionResponseDTO>> updateSanction(
            @PathVariable Long id,
            @Valid @RequestBody SanctionRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.ok(disciplineService.updateSanction(id, request)));
    }

    @DeleteMapping("/sanctions/{id}")
    public ResponseEntity<Void> deleteSanction(@PathVariable Long id) {
        disciplineService.deleteSanction(id);
        return ResponseEntity.noContent().build();
    }
}
