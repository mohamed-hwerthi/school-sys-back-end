package com.schoolSys.schooolSys.admin;

import com.schoolSys.schooolSys.admin.dto.AdminHomeDTO;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints alimentant les cartes du home admin (KPI + alertes opérationnelles).
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminHomeController {

    private final AdminHomeService adminHomeService;

    /** MOB-FUNC-025 — 6 KPI agrégés pour l'accueil admin (effectif, CA, impayés…). */
    @GetMapping("/dashboard-kpis")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<ApiResponse<AdminHomeDTO.DashboardKpis>> getDashboardKpis(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(adminHomeService.getDashboardKpis(anneeScolaire)));
    }

    /** MOB-FUNC-028 — alertes opérationnelles (impayés en retard, absentees, classes sans titulaire). */
    @GetMapping("/operational-alerts")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<ApiResponse<AdminHomeDTO.OperationalAlerts>> getOperationalAlerts(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(adminHomeService.getOperationalAlerts(anneeScolaire)));
    }
}
