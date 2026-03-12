package com.schoolSys.schooolSys.rh;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CongeRepository extends JpaRepository<Conge, Long> {

    List<Conge> findByEnseignantId(Long enseignantId);

    List<Conge> findByStatut(String statut);

    List<Conge> findByEnseignantIdAndStatut(Long enseignantId, String statut);
}
