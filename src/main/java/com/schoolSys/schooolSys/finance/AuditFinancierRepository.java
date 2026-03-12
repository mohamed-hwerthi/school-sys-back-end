package com.schoolSys.schooolSys.finance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditFinancierRepository extends JpaRepository<AuditFinancier, Long> {

    List<AuditFinancier> findByEntityTypeAndEntityId(String entityType, Long entityId);

    List<AuditFinancier> findByEntityTypeOrderByCreatedAtDesc(String entityType);
}
