package com.schoolSys.schooolSys.reporting;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.reporting.dto.ClassStatsDTO;
import com.schoolSys.schooolSys.reporting.dto.DashboardStatsDTO;
import com.schoolSys.schooolSys.reporting.dto.MonthlyTrendDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reporting")
@RequiredArgsConstructor
public class ReportingController {

    private final ReportingService reportingService;

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

    @GetMapping("/trends")
    @PreAuthorize("hasAuthority('VIEW_REPORTS')")
    public ResponseEntity<ApiResponse<List<MonthlyTrendDTO>>> getTrends(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(reportingService.getMonthlyTrends(anneeScolaire)));
    }
}
