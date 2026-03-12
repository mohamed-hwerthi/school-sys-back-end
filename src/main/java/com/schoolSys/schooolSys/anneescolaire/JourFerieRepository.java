package com.schoolSys.schooolSys.anneescolaire;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JourFerieRepository extends JpaRepository<JourFerie, Long> {

    List<JourFerie> findByAnneeScolaireId(Long anneeScolaireId);
}
