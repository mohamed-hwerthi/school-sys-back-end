package com.schoolSys.schooolSys.audit;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByUserId(Long userId);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findByEntityType(String entityType);

    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);

    @Query("SELECT a FROM AuditLog a WHERE a.createdAt BETWEEN :from AND :to ORDER BY a.createdAt DESC")
    List<AuditLog> findByDateRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);

    @Query("SELECT a FROM AuditLog a WHERE "
            + "(:userId IS NULL OR a.userId = :userId) "
            + "AND (:action IS NULL OR a.action = :action) "
            + "AND (:entityType IS NULL OR a.entityType = :entityType) "
            + "ORDER BY a.createdAt DESC")
    List<AuditLog> findByFilters(
            @Param("userId") Long userId,
            @Param("action") String action,
            @Param("entityType") String entityType);
}
