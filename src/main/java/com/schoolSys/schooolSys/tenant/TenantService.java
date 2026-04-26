package com.schoolSys.schooolSys.tenant;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.common.multitenancy.TenantFlywayConfig;
import com.schoolSys.schooolSys.tenant.dto.TenantRequestDTO;
import com.schoolSys.schooolSys.tenant.dto.TenantResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Service responsible for managing school tenants.
 * <p>
 * When a new tenant is created, this service:
 * <ol>
 *     <li>Validates the schema name (alphanumeric + underscores only)</li>
 *     <li>Creates a new PostgreSQL schema via Flyway</li>
 *     <li>Runs all tenant-specific Flyway migrations on the new schema</li>
 *     <li>Persists the tenant record in the {@code public} schema</li>
 * </ol>
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TenantService {

    private static final Pattern VALID_SCHEMA = Pattern.compile("^[a-z][a-z0-9_]{2,62}$");

    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;
    private final TenantFlywayConfig tenantFlywayConfig;

    /**
     * Returns all registered tenants.
     *
     * @return list of tenant DTOs
     */
    public List<TenantResponseDTO> findAll() {
        return tenantRepository.findAll().stream()
                .map(tenantMapper::toResponseDTO)
                .toList();
    }

    /**
     * Finds a tenant by its ID.
     *
     * @param id the tenant ID
     * @return the tenant DTO
     * @throws ResourceNotFoundException if the tenant does not exist
     */
    public TenantResponseDTO findById(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant", id));
        return tenantMapper.toResponseDTO(tenant);
    }

    /**
     * Creates a new school tenant with its own PostgreSQL schema.
     * <p>
     * The schema is created and initialized using Flyway before
     * the tenant record is persisted.
     * </p>
     *
     * @param dto the tenant creation request
     * @return the created tenant DTO
     * @throws IllegalArgumentException if the schema name is invalid or already exists
     */
    @Transactional
    public TenantResponseDTO create(TenantRequestDTO dto) {
        String schemaName = dto.getSchemaName().toLowerCase().trim();

        if (!VALID_SCHEMA.matcher(schemaName).matches()) {
            throw new IllegalArgumentException(
                    "Schema name must be lowercase, start with a letter, "
                    + "contain only letters/digits/underscores, and be 3-63 characters long");
        }

        if (tenantRepository.existsBySchemaName(schemaName)) {
            throw new IllegalArgumentException("Schema '" + schemaName + "' already exists");
        }

        // Create schema and run Flyway migrations
        tenantFlywayConfig.migrateTenantSchema(schemaName);

        Tenant tenant = tenantMapper.toEntity(dto);
        tenant.setSchemaName(schemaName);

        // Generate slug from name if not provided
        String slug = (dto.getSlug() != null && !dto.getSlug().isBlank())
                ? slugify(dto.getSlug())
                : slugify(dto.getName());
        tenant.setSlug(slug);

        return tenantMapper.toResponseDTO(tenantRepository.save(tenant));
    }

    /**
     * Finds an active tenant by its public slug.
     *
     * @param slug the URL-friendly slug
     * @return the tenant
     * @throws ResourceNotFoundException if no active tenant matches
     */
    public Tenant findBySlug(String slug) {
        return tenantRepository.findBySlugAndActiveTrue(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant with slug: " + slug));
    }

    /**
     * Converts a string into a URL-friendly slug.
     */
    public static String slugify(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String slug = normalized
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        return slug;
    }

    /**
     * Updates an existing tenant's metadata (not the schema name).
     *
     * @param id  the tenant ID
     * @param dto the update request
     * @return the updated tenant DTO
     */
    @Transactional
    public TenantResponseDTO update(Long id, TenantRequestDTO dto) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant", id));
        tenant.setName(dto.getName());
        tenant.setContactEmail(dto.getContactEmail());
        return tenantMapper.toResponseDTO(tenantRepository.save(tenant));
    }

    /**
     * Deactivates a tenant (soft delete — the schema is preserved).
     *
     * @param id the tenant ID
     */
    @Transactional
    public void deactivate(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant", id));
        tenant.setActive(false);
        tenantRepository.save(tenant);
    }
}
