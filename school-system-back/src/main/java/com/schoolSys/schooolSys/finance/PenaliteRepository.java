package com.schoolSys.schooolSys.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PenaliteRepository extends JpaRepository<Penalite, Long> {

    List<Penalite> findByStudentIdAndAnneeScolaire(Long studentId, String anneeScolaire);

    List<Penalite> findByAnneeScolaire(String anneeScolaire);

    @Query("SELECT COALESCE(SUM(p.montant), 0) FROM Penalite p WHERE p.anneeScolaire = :annee")
    BigDecimal sumMontantByAnneeScolaire(@Param("annee") String anneeScolaire);

    @Query("SELECT COALESCE(SUM(p.montant), 0) FROM Penalite p WHERE p.anneeScolaire = :annee AND p.payee = false")
    BigDecimal sumMontantImpayesByAnneeScolaire(@Param("annee") String anneeScolaire);

    long countByAnneeScolaire(String anneeScolaire);
}
