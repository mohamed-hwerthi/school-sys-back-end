package com.schoolSys.schooolSys.devoir;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.devoir.dto.CreateDevoirRequest;
import com.schoolSys.schooolSys.devoir.dto.DevoirDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devoirs")
@RequiredArgsConstructor
public class DevoirController {

    private final DevoirService devoirService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<DevoirDTO>>> getAll(
            @RequestParam(required = false) Long classeId,
            @RequestParam(required = false) Long moduleId) {
        return ResponseEntity.ok(ApiResponse.ok(devoirService.findAll(classeId, moduleId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<DevoirDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(devoirService.findById(id)));
    }

    @GetMapping("/classe/{classeId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<DevoirDTO>>> getByClasse(@PathVariable Long classeId) {
        return ResponseEntity.ok(ApiResponse.ok(devoirService.findByClasse(classeId)));
    }

    @GetMapping("/module/{moduleId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<DevoirDTO>>> getByModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(ApiResponse.ok(devoirService.findByModule(moduleId)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<DevoirDTO>> create(@Valid @RequestBody CreateDevoirRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(devoirService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<DevoirDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateDevoirRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(devoirService.update(id, request)));
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<DevoirDTO>> close(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(devoirService.closeDevoir(id)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        devoirService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
