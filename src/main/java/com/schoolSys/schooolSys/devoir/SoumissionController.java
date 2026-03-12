package com.schoolSys.schooolSys.devoir;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.devoir.dto.CorrectionRequest;
import com.schoolSys.schooolSys.devoir.dto.CreateSoumissionRequest;
import com.schoolSys.schooolSys.devoir.dto.DevoirStatsDTO;
import com.schoolSys.schooolSys.devoir.dto.SoumissionDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soumissions")
@RequiredArgsConstructor
public class SoumissionController {

    private final SoumissionService soumissionService;

    @GetMapping("/devoir/{devoirId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<SoumissionDTO>>> getByDevoir(@PathVariable Long devoirId) {
        return ResponseEntity.ok(ApiResponse.ok(soumissionService.findByDevoir(devoirId)));
    }

    @GetMapping("/eleve/{eleveId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<SoumissionDTO>>> getByEleve(@PathVariable Long eleveId) {
        return ResponseEntity.ok(ApiResponse.ok(soumissionService.findByEleve(eleveId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<SoumissionDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(soumissionService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<SoumissionDTO>> submit(@Valid @RequestBody CreateSoumissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(soumissionService.submit(request)));
    }

    @PutMapping("/{id}/correct")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<SoumissionDTO>> correct(
            @PathVariable Long id,
            @Valid @RequestBody CorrectionRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(soumissionService.correct(id, request)));
    }

    @GetMapping("/stats/{devoirId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<DevoirStatsDTO>> getStats(@PathVariable Long devoirId) {
        return ResponseEntity.ok(ApiResponse.ok(soumissionService.getStats(devoirId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        soumissionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
