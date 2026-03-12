package com.schoolSys.schooolSys.inscription;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InscriptionRepository extends JpaRepository<Inscription, Long> {

    Page<Inscription> findByStatut(String statut, Pageable pageable);

    Page<Inscription> findByAnneeScolaire(String anneeScolaire, Pageable pageable);

    Page<Inscription> findByStatutAndAnneeScolaire(String statut, String anneeScolaire, Pageable pageable);

    Page<Inscription> findByNiveauId(Long niveauId, Pageable pageable);

    Page<Inscription> findByStatutAndNiveauId(String statut, Long niveauId, Pageable pageable);

    Page<Inscription> findByAnneeScolaireAndNiveauId(String anneeScolaire, Long niveauId, Pageable pageable);

    Page<Inscription> findByStatutAndAnneeScolaireAndNiveauId(String statut, String anneeScolaire, Long niveauId, Pageable pageable);

    Optional<Inscription> findByNumeroDossier(String numeroDossier);

    long countByNiveauIdAndAnneeScolaireAndStatut(Long niveauId, String anneeScolaire, String statut);

    long countByStatut(String statut);

    long countByAnneeScolaire(String anneeScolaire);

    @Query("SELECT COUNT(i) FROM Inscription i WHERE i.anneeScolaire = :annee AND i.statut = :statut")
    long countByAnneeScolaireAndStatut(@Param("annee") String anneeScolaire, @Param("statut") String statut);
}
