package com.schoolSys.schooolSys.finance;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.finance.dto.TresorerieDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tresorerie")
@RequiredArgsConstructor
public class TresorerieController {

    private final TresorerieService tresorerieService;

    @GetMapping
    public ResponseEntity<ApiResponse<TresorerieDTO>> getTresorerie(
            @RequestParam String anneeScolaire) {
        return ResponseEntity.ok(ApiResponse.ok(tresorerieService.getTresorerie(anneeScolaire)));
    }
}
