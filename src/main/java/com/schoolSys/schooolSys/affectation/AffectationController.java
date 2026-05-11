package com.schoolSys.schooolSys.affectation;

import com.schoolSys.schooolSys.affectation.dto.AffectationDTO;
import com.schoolSys.schooolSys.affectation.dto.AffectationRequestDTO;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/affectations")
@RequiredArgsConstructor
public class AffectationController {

    private final AffectationService affectationService;

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_TEACHERS')")
    public ResponseEntity<ApiResponse<List<AffectationDTO>>> search(
            @RequestParam(required = false) Long teacherId,
            @RequestParam(required = false) Long classeId,
            @RequestParam(required = false) Long moduleId,
            @RequestParam(required = false) String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(
                affectationService.search(teacherId, classeId, moduleId, anneeScolaire)
        ));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_TEACHERS')")
    public ResponseEntity<ApiResponse<AffectationDTO>> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(affectationService.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_TEACHERS')")
    public ResponseEntity<ApiResponse<AffectationDTO>> create(
            @Valid @RequestBody AffectationRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(affectationService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_TEACHERS')")
    public ResponseEntity<ApiResponse<AffectationDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody AffectationRequestDTO request) {
        return ResponseEntity.ok(ApiResponse.ok(affectationService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_TEACHERS')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        affectationService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
