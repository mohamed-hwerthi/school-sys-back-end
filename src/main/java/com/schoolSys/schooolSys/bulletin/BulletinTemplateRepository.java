package com.schoolSys.schooolSys.bulletin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BulletinTemplateRepository extends JpaRepository<BulletinTemplate, Long> {
    Optional<BulletinTemplate> findByActifTrue();

    @Modifying
    @Query("UPDATE BulletinTemplate t SET t.actif = false WHERE t.actif = true")
    void deactivateAll();
}
