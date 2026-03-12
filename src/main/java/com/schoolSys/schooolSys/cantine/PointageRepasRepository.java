package com.schoolSys.schooolSys.cantine;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PointageRepasRepository extends JpaRepository<PointageRepas, Long> {

    List<PointageRepas> findByDateRepas(LocalDate dateRepas);

    List<PointageRepas> findByDateRepasAndTypeRepas(LocalDate dateRepas, String typeRepas);

    List<PointageRepas> findByEleveId(Long eleveId);

    @Query("SELECT COUNT(p) FROM PointageRepas p WHERE p.dateRepas = :date AND p.present = true")
    long countPresentsByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(p) FROM PointageRepas p WHERE p.dateRepas = :date")
    long countByDate(@Param("date") LocalDate date);
}
