package com.schoolSys.schooolSys.transport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArretRepository extends JpaRepository<Arret, Long> {

    List<Arret> findByCircuitIdOrderByOrdreAsc(Long circuitId);
}
