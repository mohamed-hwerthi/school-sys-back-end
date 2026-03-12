package com.schoolSys.schooolSys.absence;

import com.schoolSys.schooolSys.absence.dto.*;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/absences")
@RequiredArgsConstructor
public class AbsenceController {

    private final AbsenceService absenceService;

    @PostMapping("/batch")
    @PreAuthorize("hasAuthority('WRITE_ABSENCES')")
    public ResponseEntity<ApiResponse<List<AbsenceResponseDTO>>> batchCreate(
            @Valid @RequestBody AbsenceBatchRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.ok(absenceService.batchCreate(request)));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('READ_ABSENCES')")
    public ResponseEntity<ApiResponse<List<AbsenceResponseDTO>>> getByClasseAndDate(
            @RequestParam Long classeId,
            @RequestParam LocalDate date,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(ApiResponse.ok(absenceService.getByClasseAndDate(classeId, date, type)));
    }

    @GetMapping("/eleve/{eleveId}")
    @PreAuthorize("hasAuthority('READ_ABSENCES')")
    public ResponseEntity<ApiResponse<List<AbsenceResponseDTO>>> getByEleve(@PathVariable Long eleveId) {
        return ResponseEntity.ok(ApiResponse.ok(absenceService.getByEleve(eleveId)));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('READ_ABSENCES')")
    public ResponseEntity<ApiResponse<AbsenceStatsDTO>> getStats(
            @RequestParam Long classeId,
            @RequestParam int mois,
            @RequestParam int annee) {
        return ResponseEntity.ok(ApiResponse.ok(absenceService.getStats(classeId, mois, annee)));
    }

    @PutMapping("/{id}/justifier")
    @PreAuthorize("hasAuthority('WRITE_ABSENCES')")
    public ResponseEntity<ApiResponse<AbsenceResponseDTO>> justifier(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(absenceService.justifier(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_ABSENCES')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        absenceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
