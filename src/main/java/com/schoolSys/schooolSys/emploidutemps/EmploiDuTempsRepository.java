package com.schoolSys.schooolSys.emploidutemps;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmploiDuTempsRepository extends JpaRepository<EmploiDuTemps, Long> {

    List<EmploiDuTemps> findByClasseId(Long classeId);

    List<EmploiDuTemps> findByEnseignantId(Long enseignantId);

    List<EmploiDuTemps> findByEnseignantIdAndJourSemaineAndCreneauId(Long enseignantId, Integer jourSemaine, Long creneauId);

    List<EmploiDuTemps> findBySalleAndJourSemaineAndCreneauId(String salle, Integer jourSemaine, Long creneauId);

    void deleteByClasseId(Long classeId);
}
