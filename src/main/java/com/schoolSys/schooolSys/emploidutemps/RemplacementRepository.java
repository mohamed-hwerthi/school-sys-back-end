package com.schoolSys.schooolSys.emploidutemps;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface RemplacementRepository extends JpaRepository<Remplacement, Long> {
    List<Remplacement> findByEnseignantRemplacantIdAndDateDebutLessThanEqualAndDateFinGreaterThanEqual(
            Long enseignantId, LocalDate fin, LocalDate debut);
    List<Remplacement> findByEmploiDuTempsIdIn(List<Long> emploiDuTempsIds);
}
