package com.schoolSys.schooolSys.devoir;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RessourcePedagogiqueRepository extends JpaRepository<RessourcePedagogique, Long> {

    List<RessourcePedagogique> findByModuleIdOrderByCreatedAtDesc(Long moduleId);

    List<RessourcePedagogique> findByEnseignantIdOrderByCreatedAtDesc(Long enseignantId);

    List<RessourcePedagogique> findByTypeOrderByCreatedAtDesc(String type);

    List<RessourcePedagogique> findAllByOrderByCreatedAtDesc();
}
