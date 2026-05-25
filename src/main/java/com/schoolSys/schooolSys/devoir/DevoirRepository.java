package com.schoolSys.schooolSys.devoir;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DevoirRepository extends JpaRepository<Devoir, UUID> {

    List<Devoir> findByClasseIdOrderByDateLimiteDesc(UUID classeId);

    List<Devoir> findByModuleIdOrderByDateLimiteDesc(UUID moduleId);

    List<Devoir> findByClasseIdAndModuleIdOrderByDateLimiteDesc(UUID classeId, UUID moduleId);

    List<Devoir> findByEnseignantIdOrderByDateLimiteDesc(UUID enseignantId);

    List<Devoir> findByStatutOrderByDateLimiteDesc(String statut);

    List<Devoir> findAllByOrderByDateLimiteDesc();
}
