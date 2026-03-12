package com.schoolSys.schooolSys.facture;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.facture.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/factures")
@RequiredArgsConstructor
public class FactureController {

    private final FactureService factureService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FactureResponseDTO>>> getAllFactures() {
        return ResponseEntity.ok(ApiResponse.ok(factureService.getAllFactures()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FactureResponseDTO>> getFactureById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(factureService.getFactureById(id)));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<FactureResponseDTO>>> getFacturesByStudent(
            @PathVariable Long studentId) {
        return ResponseEntity.ok(ApiResponse.ok(factureService.getFacturesByStudent(studentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<FactureResponseDTO>> createFacture(
            @Valid @RequestBody FactureRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(factureService.createFacture(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FactureResponseDTO>> updateFacture(
            @PathVariable Long id, @Valid @RequestBody FactureRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(factureService.updateFacture(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacture(@PathVariable Long id) {
        factureService.deleteFacture(id);
        return ResponseEntity.noContent().build();
    }
}
