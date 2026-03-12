package com.schoolSys.schooolSys.anneescolaire;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrimestreRepository extends JpaRepository<Trimestre, Long> {

    List<Trimestre> findByAnneeScolaireId(Long anneeScolaireId);
}
