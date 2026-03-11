package com.schoolSys.schooolSys.tenant;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.tenant.dto.TenantRequestDTO;
import com.schoolSys.schooolSys.tenant.dto.TenantResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing school tenants.
 * <p>
 * These endpoints operate on the {@code public} schema and do NOT
 * require the {@code X-Tenant-ID} header.
 * </p>
 */
@RestController
@RequestMapping("/api/tenants")
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;

    /**
     * Lists all registered schools.
     *
     * @return all tenants
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TenantResponseDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(tenantService.findAll()));
    }

    /**
     * Gets a single tenant by ID.
     *
     * @param id the tenant ID
     * @return the tenant
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TenantResponseDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(tenantService.findById(id)));
    }

    /**
     * Registers a new school and creates its dedicated PostgreSQL schema.
     *
     * @param dto the tenant creation request
     * @return the created tenant
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TenantResponseDTO>> create(@RequestBody TenantRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(tenantService.create(dto)));
    }

    /**
     * Updates a tenant's metadata.
     *
     * @param id  the tenant ID
     * @param dto the update request
     * @return the updated tenant
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TenantResponseDTO>> update(@PathVariable Long id,
                                                                  @RequestBody TenantRequestDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok(tenantService.update(id, dto)));
    }

    /**
     * Deactivates a school (soft delete — the schema is preserved).
     *
     * @param id the tenant ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        tenantService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
