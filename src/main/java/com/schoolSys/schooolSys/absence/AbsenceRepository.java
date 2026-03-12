package com.schoolSys.schooolSys.absence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, Long> {

    List<Absence> findByEleveId(Long eleveId);

    List<Absence> findByEleveIdIn(List<Long> eleveIds);

    List<Absence> findByDateAndEleveIdIn(LocalDate date, List<Long> eleveIds);

    List<Absence> findByDateAndEleveIdInAndType(LocalDate date, List<Long> eleveIds, String type);

    @Query("SELECT a FROM Absence a WHERE a.eleveId IN :eleveIds AND MONTH(a.date) = :mois AND YEAR(a.date) = :annee")
    List<Absence> findByEleveIdInAndMonthAndYear(@Param("eleveIds") List<Long> eleveIds,
                                                  @Param("mois") int mois,
                                                  @Param("annee") int annee);
}
