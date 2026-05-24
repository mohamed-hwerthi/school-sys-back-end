package com.schoolSys.schooolSys.reporting;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.common.security.CurrentUserContext;
import com.schoolSys.schooolSys.reporting.dto.ClassDrillDownDTO;
import com.schoolSys.schooolSys.reporting.dto.ClassStatsDTO;
import com.schoolSys.schooolSys.reporting.dto.DashboardStatsDTO;
import com.schoolSys.schooolSys.reporting.dto.MonthlyTrendDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/reporting")
@RequiredArgsConstructor
public class ReportingController {

    private final ReportingService reportingService;
    private final CurrentUserContext currentUser;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboard(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(reportingService.getDashboardStats(anneeScolaire)));
    }

    @GetMapping("/admin/class-stats")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<ApiResponse<List<ClassStatsDTO>>> getClassStats(
            @RequestParam(defaultValue = "1") int trimestre) {
        return ResponseEntity.ok(ApiResponse.ok(reportingService.getClassStats(trimestre)));
    }

    /**
     * Per-class stats scoped to the authenticated teacher's affectations.
     * Authorised by READ_NOTES (which every ENSEIGNANT holds).
     */
    @GetMapping("/teacher/my-class-stats")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<ClassStatsDTO>>> getMyClassStats(
            @RequestParam(defaultValue = "1") int trimestre) {
        List<ClassStatsDTO> all = reportingService.getClassStats(trimestre);
        Set<UUID> scoped = currentUser.getScopedClasseIdsForTeacher();
        List<ClassStatsDTO> mine = all.stream()
                .filter(s -> scoped.contains(s.getClasseId()))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(mine));
    }

    @GetMapping("/trends")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<ApiResponse<List<MonthlyTrendDTO>>> getTrends(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(reportingService.getMonthlyTrends(anneeScolaire)));
    }

    /** MOB-FUNC-016 — distribution des notes d'une classe par tranche. */
    @GetMapping("/class/{classeId}/grade-distribution")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<ClassDrillDownDTO.GradeDistribution>> getGradeDistribution(
            @PathVariable UUID classeId,
            @RequestParam(defaultValue = "1") int trimestre,
            @RequestParam(required = false) UUID moduleId) {
        return ResponseEntity.ok(ApiResponse.ok(
                reportingService.getGradeDistribution(classeId, trimestre, moduleId)));
    }

    /** MOB-FUNC-017 — évolution trimestrielle d'une classe vs moyenne école. */
    @GetMapping("/class/{classeId}/trimestre-evolution")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<ClassDrillDownDTO.TrimestreEvolution>> getTrimestreEvolution(
            @PathVariable UUID classeId) {
        return ResponseEntity.ok(ApiResponse.ok(reportingService.getTrimestreEvolution(classeId)));
    }

    /** MOB-FUNC-018 — top/flop élèves d'une classe pour un trimestre. */
    @GetMapping("/class/{classeId}/top-flop")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<ClassDrillDownDTO.TopFlop>> getTopFlop(
            @PathVariable UUID classeId,
            @RequestParam(defaultValue = "1") int trimestre,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(ApiResponse.ok(reportingService.getTopFlop(classeId, trimestre, limit)));
    }
}
