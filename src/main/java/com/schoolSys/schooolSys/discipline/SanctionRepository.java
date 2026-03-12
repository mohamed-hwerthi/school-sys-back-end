package com.schoolSys.schooolSys.discipline;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanctionRepository extends JpaRepository<Sanction, Long> {

    List<Sanction> findByEleveId(Long eleveId);

    List<Sanction> findByIncidentId(Long incidentId);
}
