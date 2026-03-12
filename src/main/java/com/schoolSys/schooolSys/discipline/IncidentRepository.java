package com.schoolSys.schooolSys.discipline;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    List<Incident> findByDateBetween(LocalDate start, LocalDate end);

    List<Incident> findByType(String type);

    List<Incident> findByGravite(String gravite);
}
