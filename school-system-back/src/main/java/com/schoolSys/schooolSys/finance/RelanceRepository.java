package com.schoolSys.schooolSys.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RelanceRepository extends JpaRepository<Relance, Long> {

    List<Relance> findByAnneeScolaireOrderByCreatedAtDesc(String anneeScolaire);

    List<Relance> findByStudentIdAndAnneeScolaireOrderByCreatedAtDesc(Long studentId, String anneeScolaire);

    List<Relance> findByStatutAndAnneeScolaireOrderByDatePrevueAsc(
            Relance.StatutRelance statut, String anneeScolaire);

    long countByAnneeScolaireAndStatut(String anneeScolaire, Relance.StatutRelance statut);

    long countByAnneeScolaire(String anneeScolaire);

    @Query("SELECT MAX(r.numeroRelance) FROM Relance r WHERE r.student.id = :studentId AND r.anneeScolaire = :annee")
    Integer findMaxNumeroRelanceByStudentAndAnnee(@Param("studentId") Long studentId, @Param("annee") String annee);

    boolean existsByStudentIdAndPaiementIdAndStatut(Long studentId, Long paiementId, Relance.StatutRelance statut);
}
