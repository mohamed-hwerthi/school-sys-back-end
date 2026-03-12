package com.schoolSys.schooolSys.tenant;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Represents a registered school (tenant) in the system.
 * <p>
 * Each tenant maps to a dedicated PostgreSQL schema identified by
 * {@link #schemaName}. This entity is always stored in the {@code public}
 * schema so it is accessible regardless of the current tenant context.
 * </p>
 */
@Entity
@Table(name = "tenants", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Display name of the school. */
    @Column(nullable = false)
    private String name;

    /**
     * PostgreSQL schema name for this school.
     * Must be lowercase, alphanumeric with underscores only.
     */
    @Column(name = "schema_name", unique = true, nullable = false)
    private String schemaName;

    /** Contact email for the school administrator. */
    @Column(unique = true, nullable = false)
    private String contactEmail;

    /** URL-friendly slug for the public vitrine (e.g. "ecole-einstein"). */
    @Column(unique = true, nullable = false)
    private String slug;

    /** Whether the tenant is currently active. */
    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
