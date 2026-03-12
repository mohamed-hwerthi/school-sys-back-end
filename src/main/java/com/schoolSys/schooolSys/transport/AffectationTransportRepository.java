package com.schoolSys.schooolSys.transport;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffectationTransportRepository extends JpaRepository<AffectationTransport, Long> {

    List<AffectationTransport> findByCircuitIdAndActifTrue(Long circuitId);

    List<AffectationTransport> findByEleveIdAndActifTrue(Long eleveId);

    List<AffectationTransport> findByCircuitId(Long circuitId);

    List<AffectationTransport> findByEleveId(Long eleveId);

    @Query("SELECT COUNT(a) FROM AffectationTransport a WHERE a.actif = true")
    long countActifs();

    @Query("SELECT COUNT(a) FROM AffectationTransport a WHERE a.circuit.id = :circuitId AND a.actif = true")
    long countByCircuitIdAndActifTrue(@Param("circuitId") Long circuitId);
}
