package com.schoolSys.schooolSys.devoir;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SoumissionRepository extends JpaRepository<Soumission, Long> {

    List<Soumission> findByDevoirIdOrderByDateSoumissionDesc(Long devoirId);

    List<Soumission> findByEleveIdOrderByDateSoumissionDesc(Long eleveId);

    List<Soumission> findByDevoirIdAndEleveId(Long devoirId, Long eleveId);

    long countByDevoirId(Long devoirId);

    long countByDevoirIdAndCorrigeTrue(Long devoirId);

    long countByDevoirIdAndEnRetardTrue(Long devoirId);
}
