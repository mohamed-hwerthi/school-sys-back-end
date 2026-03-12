package com.schoolSys.schooolSys.tenant;

import com.schoolSys.schooolSys.common.multitenancy.TenantFlywayConfig;
import com.schoolSys.schooolSys.tenant.dto.TenantOnboardingRequest;
import com.schoolSys.schooolSys.tenant.dto.TenantResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TenantOnboardingService {

    private final TenantRepository tenantRepository;
    private final TenantMapper tenantMapper;
    private final TenantFlywayConfig tenantFlywayConfig;

    private static final Map<String, PlanDefaults> PLAN_DEFAULTS = Map.of(
            "FREE", new PlanDefaults(50, 10, 500, BigDecimal.ZERO),
            "STANDARD", new PlanDefaults(200, 30, 2000, BigDecimal.valueOf(49.99)),
            "PREMIUM", new PlanDefaults(500, 100, 10000, BigDecimal.valueOf(149.99)),
            "ENTERPRISE", new PlanDefaults(Integer.MAX_VALUE, Integer.MAX_VALUE, 50000, BigDecimal.valueOf(499.99))
    );

    @Transactional
    public TenantResponseDTO onboard(TenantOnboardingRequest request) {
        String slug = slugify(request.getSlug() != null && !request.getSlug().isBlank()
                ? request.getSlug()
                : request.getSchoolName());

        String schemaName = slug.replace("-", "_");

        if (tenantRepository.existsBySchemaName(schemaName)) {
            throw new IllegalArgumentException("A school with this name already exists");
        }

        // Determine plan
        String plan = request.getPlan() != null ? request.getPlan().toUpperCase() : "FREE";
        PlanDefaults defaults = PLAN_DEFAULTS.getOrDefault(plan, PLAN_DEFAULTS.get("FREE"));

        // Create and initialize tenant schema
        tenantFlywayConfig.migrateTenantSchema(schemaName);

        Tenant tenant = Tenant.builder()
                .name(request.getSchoolName())
                .schemaName(schemaName)
                .slug(slug)
                .contactEmail(request.getAdminEmail())
                .active(true)
                .plan(plan)
                .maxStudents(defaults.maxStudents)
                .maxTeachers(defaults.maxTeachers)
                .maxStorageMb(defaults.maxStorageMb)
                .monthlyRate(defaults.monthlyRate)
                .billingEmail(request.getAdminEmail())
                .billingCycle("MONTHLY")
                .trialEndsAt("FREE".equals(plan) ? null : LocalDate.now().plusDays(30))
                .onboardingCompleted(true)
                .build();

        Tenant saved = tenantRepository.save(tenant);
        log.info("Onboarded new tenant: {} (schema: {}, plan: {})", saved.getName(), schemaName, plan);

        return tenantMapper.toResponseDTO(saved);
    }

    private String slugify(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        return normalized
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("[\\s]+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private record PlanDefaults(int maxStudents, int maxTeachers, int maxStorageMb, BigDecimal monthlyRate) {}
}
