package com.schoolSys.schooolSys.tenant;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data repository for {@link Tenant} entities.
 */
public interface TenantRepository extends JpaRepository<Tenant, Long> {

    /**
     * Finds a tenant by its PostgreSQL schema name.
     *
     * @param schemaName the schema name
     * @return the tenant if found
     */
    Optional<Tenant> findBySchemaName(String schemaName);

    /**
     * Checks whether a schema name is already registered.
     *
     * @param schemaName the schema name to check
     * @return {@code true} if it exists
     */
    boolean existsBySchemaName(String schemaName);
}
