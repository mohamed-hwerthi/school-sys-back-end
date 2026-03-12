package com.schoolSys.schooolSys.inscription;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ListeAttenteRepository extends JpaRepository<ListeAttente, Long> {

    List<ListeAttente> findByNiveauIdAndAnneeScolaireOrderByPosition(Long niveauId, String anneeScolaire);

    @Query("SELECT COALESCE(MAX(la.position), 0) FROM ListeAttente la WHERE la.niveauId = :niveauId AND la.anneeScolaire = :annee")
    int findMaxPositionByNiveauIdAndAnneeScolaire(@Param("niveauId") Long niveauId, @Param("annee") String anneeScolaire);

    Optional<ListeAttente> findByInscriptionId(Long inscriptionId);
}
