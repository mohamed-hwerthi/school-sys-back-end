package com.schoolSys.schooolSys.analytics;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KpiConfigRepository extends JpaRepository<KpiConfig, Long> {

    List<KpiConfig> findByActifTrue();

    List<KpiConfig> findByType(String type);
}
