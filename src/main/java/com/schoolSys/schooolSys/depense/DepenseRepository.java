package com.schoolSys.schooolSys.depense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface DepenseRepository extends JpaRepository<Depense, Long>, JpaSpecificationExecutor<Depense> {

    List<Depense> findByAnneeScolaire(String anneeScolaire);

    List<Depense> findByCategorieId(Long categorieId);

    @Query("SELECT COALESCE(SUM(d.montant), 0) FROM Depense d WHERE d.anneeScolaire = :annee")
    BigDecimal sumMontantByAnneeScolaire(@Param("annee") String anneeScolaire);

    @Query("SELECT COALESCE(SUM(d.montant), 0) FROM Depense d WHERE d.categorie.id = :catId AND d.anneeScolaire = :annee")
    BigDecimal sumMontantByCategorieAndAnneeScolaire(@Param("catId") Long categorieId, @Param("annee") String anneeScolaire);
}
