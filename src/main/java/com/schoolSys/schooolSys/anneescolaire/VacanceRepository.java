package com.schoolSys.schooolSys.anneescolaire;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacanceRepository extends JpaRepository<Vacance, Long> {

    List<Vacance> findByAnneeScolaireId(Long anneeScolaireId);
}
