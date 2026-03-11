package com.schoolSys.schooolSys.niveau;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.niveau.dto.ClasseRequestDTO;
import com.schoolSys.schooolSys.niveau.dto.NiveauRequestDTO;
import com.schoolSys.schooolSys.niveau.dto.NiveauResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/niveaux")
@RequiredArgsConstructor
public class NiveauController {

    private final NiveauService niveauService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NiveauResponseDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(niveauService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NiveauResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(niveauService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NiveauResponseDTO>> create(
            @Valid @RequestBody NiveauRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(niveauService.create(dto.getName())));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        niveauService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/classes")
    public ResponseEntity<ApiResponse<NiveauResponseDTO>> addClasse(
            @PathVariable Long id,
            @Valid @RequestBody ClasseRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(niveauService.addClasse(id, dto.getLetter())));
    }

    @DeleteMapping("/{id}/classes/{letter}")
    public ResponseEntity<Void> removeClasse(
            @PathVariable Long id,
            @PathVariable String letter) {
        niveauService.removeClasse(id, letter);
        return ResponseEntity.noContent().build();
    }
}
