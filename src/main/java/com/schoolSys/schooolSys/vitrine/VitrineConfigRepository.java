package com.schoolSys.schooolSys.vitrine;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VitrineConfigRepository extends JpaRepository<VitrineConfig, Long> {

    Optional<VitrineConfig> findFirstByOrderByIdAsc();
}
