package com.schoolSys.schooolSys.disponibilite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnseignantDisponibiliteRepository
        extends JpaRepository<EnseignantDisponibilite, Long> {

    List<EnseignantDisponibilite> findByEnseignantId(Long enseignantId);

    List<EnseignantDisponibilite> findByEnseignantIdAndType(Long enseignantId, String type);

    Optional<EnseignantDisponibilite> findByEnseignantIdAndJourSemaineAndCreneauId(
            Long enseignantId, Integer jourSemaine, Long creneauId);

    void deleteByEnseignantIdAndJourSemaineAndCreneauId(
            Long enseignantId, Integer jourSemaine, Long creneauId);
}
