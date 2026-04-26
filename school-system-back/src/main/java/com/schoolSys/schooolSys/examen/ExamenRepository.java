package com.schoolSys.schooolSys.examen;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExamenRepository extends JpaRepository<Examen, Long> {

    @Query("SELECT e FROM Examen e " +
            "WHERE (:moduleId IS NULL OR e.module.id = :moduleId) " +
            "AND (:classeId IS NULL OR e.classe.id = :classeId) " +
            "AND (:trimestre IS NULL OR e.trimestre = :trimestre) " +
            "ORDER BY e.module.niveau.name ASC, e.module.name ASC, " +
            "e.trimestre ASC, e.ordreEtatique ASC")
    List<Examen> findFiltered(
            @Param("moduleId") Long moduleId,
            @Param("classeId") Long classeId,
            @Param("trimestre") Integer trimestre);
}
