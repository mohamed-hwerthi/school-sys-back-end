package com.schoolSys.schooolSys.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface RemiseRepository extends JpaRepository<Remise, Long> {

    List<Remise> findByStudentIdAndAnneeScolaire(Long studentId, String anneeScolaire);

    List<Remise> findByAnneeScolaire(String anneeScolaire);

    List<Remise> findByStudentIdAndAnneeScolaireAndActiveTrue(Long studentId, String anneeScolaire);

    @Query("SELECT COALESCE(SUM(r.valeur), 0) FROM Remise r WHERE r.anneeScolaire = :annee AND r.active = true AND r.estPourcentage = false")
    BigDecimal sumRemisesFixesByAnneeScolaire(@Param("annee") String anneeScolaire);

    long countByAnneeScolaireAndActiveTrue(String anneeScolaire);
}
