package com.schoolSys.schooolSys.devoir;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.devoir.dto.CreateRessourceRequest;
import com.schoolSys.schooolSys.devoir.dto.RessourceDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ressources")
@RequiredArgsConstructor
public class RessourceController {

    private final RessourceService ressourceService;

    @GetMapping
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<RessourceDTO>>> getAll(
            @RequestParam(required = false) Long moduleId) {
        return ResponseEntity.ok(ApiResponse.ok(ressourceService.findAll(moduleId)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<RessourceDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(ressourceService.findById(id)));
    }

    @GetMapping("/module/{moduleId}")
    @PreAuthorize("hasAuthority('READ_NOTES')")
    public ResponseEntity<ApiResponse<List<RessourceDTO>>> getByModule(@PathVariable Long moduleId) {
        return ResponseEntity.ok(ApiResponse.ok(ressourceService.findByModule(moduleId)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<RessourceDTO>> create(@Valid @RequestBody CreateRessourceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(ressourceService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<ApiResponse<RessourceDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateRessourceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(ressourceService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('WRITE_NOTES')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ressourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
