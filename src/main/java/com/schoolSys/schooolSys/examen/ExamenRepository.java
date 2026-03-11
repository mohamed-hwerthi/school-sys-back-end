package com.schoolSys.schooolSys.examen;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamenRepository extends JpaRepository<Examen, Long> {

    List<Examen> findByModuleIdOrderByOrdreEtatiqueAsc(Long moduleId);

    List<Examen> findByClasseIdOrderByOrdreEtatiqueAsc(Long classeId);

    List<Examen> findByModuleIdAndClasseIdOrderByOrdreEtatiqueAsc(Long moduleId, Long classeId);

    List<Examen> findAllByOrderByModuleNiveauNameAscModuleNameAscOrdreEtatiqueAsc();
}
