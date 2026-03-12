package com.schoolSys.schooolSys.devoir;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevoirRepository extends JpaRepository<Devoir, Long> {

    List<Devoir> findByClasseIdOrderByDateLimiteDesc(Long classeId);

    List<Devoir> findByModuleIdOrderByDateLimiteDesc(Long moduleId);

    List<Devoir> findByClasseIdAndModuleIdOrderByDateLimiteDesc(Long classeId, Long moduleId);

    List<Devoir> findByEnseignantIdOrderByDateLimiteDesc(Long enseignantId);

    List<Devoir> findByStatutOrderByDateLimiteDesc(String statut);

    List<Devoir> findAllByOrderByDateLimiteDesc();
}
