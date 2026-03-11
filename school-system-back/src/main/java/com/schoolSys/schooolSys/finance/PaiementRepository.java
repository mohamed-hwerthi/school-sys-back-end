package com.schoolSys.schooolSys.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PaiementRepository extends JpaRepository<Paiement, Long>, JpaSpecificationExecutor<Paiement> {

    List<Paiement> findByStudentId(Long studentId);

    List<Paiement> findByStudentIdAndAnneeScolaire(Long studentId, String anneeScolaire);

    List<Paiement> findByMoisAndAnneeScolaire(String mois, String anneeScolaire);

    List<Paiement> findByStatut(Paiement.StatutPaiement statut);

    List<Paiement> findByAnneeScolaire(String anneeScolaire);

    @Query("SELECT COALESCE(SUM(p.montantPaye), 0) FROM Paiement p WHERE p.anneeScolaire = :annee")
    BigDecimal sumMontantPayeByAnneeScolaire(@Param("annee") String anneeScolaire);

    @Query("SELECT COALESCE(SUM(p.montantDu), 0) FROM Paiement p WHERE p.anneeScolaire = :annee")
    BigDecimal sumMontantDuByAnneeScolaire(@Param("annee") String anneeScolaire);

    @Query("SELECT COALESCE(SUM(p.montantPaye), 0) FROM Paiement p WHERE p.mois = :mois AND p.anneeScolaire = :annee")
    BigDecimal sumMontantPayeByMoisAndAnneeScolaire(@Param("mois") String mois, @Param("annee") String anneeScolaire);

    @Query("SELECT COALESCE(SUM(p.montantDu - p.montantPaye), 0) FROM Paiement p WHERE p.statut <> 'PAYE' AND p.anneeScolaire = :annee")
    BigDecimal sumImpayes(@Param("annee") String anneeScolaire);

    long countByStatutAndAnneeScolaire(Paiement.StatutPaiement statut, String anneeScolaire);

    boolean existsByStudentIdAndTypeFraisIdAndMoisAndAnneeScolaire(
            Long studentId, Long typeFraisId, String mois, String anneeScolaire);

    List<Paiement> findByAnneeScolaireAndStatutIn(String anneeScolaire, List<Paiement.StatutPaiement> statuts);
}
