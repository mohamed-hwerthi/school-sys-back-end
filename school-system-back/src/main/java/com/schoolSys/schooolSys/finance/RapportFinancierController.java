package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.finance.dto.RapportFinancierDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rapports-financiers")
@RequiredArgsConstructor
public class RapportFinancierController {

    private final RapportFinancierService rapportFinancierService;

    @GetMapping
    public ResponseEntity<ApiResponse<RapportFinancierDTO>> generer(
            @RequestParam(defaultValue = "2025-2026") String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(rapportFinancierService.generer(anneeScolaire)));
    }
}
