package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.common.dto.PagedResponse;
import com.schoolSys.schooolSys.finance.dto.FinanceDashboardDTO;
import com.schoolSys.schooolSys.finance.dto.PaiementRequestDTO;
import com.schoolSys.schooolSys.finance.dto.PaiementResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<PaiementResponseDTO>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String anneeScolaire,
            @RequestParam(required = false) String mois,
            @RequestParam(required = false) Paiement.StatutPaiement statut,
            @RequestParam(required = false) Paiement.ModePaiement modePaiement,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long typeFraisId,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        PagedResponse<PaiementResponseDTO> result = paiementService.findAll(
                search, anneeScolaire, mois, statut, modePaiement, studentId, typeFraisId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PaiementResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(paiementService.findById(id)));
    }

    @GetMapping("/eleve/{studentId}")
    public ResponseEntity<ApiResponse<List<PaiementResponseDTO>>> getByStudentId(
            @PathVariable Long studentId,
            @RequestParam(required = false) String anneeScolaire) {
        List<PaiementResponseDTO> result = anneeScolaire != null
                ? paiementService.findByStudentIdAndAnneeScolaire(studentId, anneeScolaire)
                : paiementService.findByStudentId(studentId);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PaiementResponseDTO>> create(
            @Valid @RequestBody PaiementRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(paiementService.create(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PaiementResponseDTO>> update(
            @PathVariable Long id, @Valid @RequestBody PaiementRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(paiementService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        paiementService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<FinanceDashboardDTO>> getDashboard(
            @RequestParam String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(paiementService.getDashboard(anneeScolaire)));
    }
}
