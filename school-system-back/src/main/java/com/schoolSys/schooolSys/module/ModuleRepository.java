package com.schoolSys.schooolSys.module;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ModuleRepository extends JpaRepository<Module, Long> {

    List<Module> findByNiveauIdOrderByOrdreEtatiqueAsc(Long niveauId);

    List<Module> findAllByOrderByNiveauNameAscOrdreEtatiqueAsc();
}
