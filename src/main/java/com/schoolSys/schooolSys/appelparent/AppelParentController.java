package com.schoolSys.schooolSys.appelparent;

import com.schoolSys.schooolSys.appelparent.dto.AppelParentRequestDTO;
import com.schoolSys.schooolSys.appelparent.dto.AppelParentResponseDTO;
import com.schoolSys.schooolSys.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appels-parents")
@RequiredArgsConstructor
public class AppelParentController {

    private final AppelParentService service;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppelParentResponseDTO>>> getAll(
            @RequestParam(required = false) Long eleveId) {
        return ResponseEntity.ok(ApiResponse.ok(service.findAll(eleveId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppelParentResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.findById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_COMMUNICATION')")
    public ResponseEntity<ApiResponse<AppelParentResponseDTO>> create(
            @Valid @RequestBody AppelParentRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(service.create(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_COMMUNICATION')")
    public ResponseEntity<ApiResponse<AppelParentResponseDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody AppelParentRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(service.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_COMMUNICATION')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
