package com.schoolSys.schooolSys.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface MouvementCaisseRepository extends JpaRepository<MouvementCaisse, Long> {

    List<MouvementCaisse> findByCaisseIdOrderByCreatedAtDesc(Long caisseId);

    @Query("SELECT COALESCE(SUM(m.montant), 0) FROM MouvementCaisse m WHERE m.caisse.id = :caisseId AND m.type = 'ENTREE'")
    BigDecimal sumEntreesByCaisseId(@Param("caisseId") Long caisseId);

    @Query("SELECT COALESCE(SUM(m.montant), 0) FROM MouvementCaisse m WHERE m.caisse.id = :caisseId AND m.type = 'SORTIE'")
    BigDecimal sumSortiesByCaisseId(@Param("caisseId") Long caisseId);
}
