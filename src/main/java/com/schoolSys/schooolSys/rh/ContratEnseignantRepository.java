package com.schoolSys.schooolSys.rh;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContratEnseignantRepository extends JpaRepository<ContratEnseignant, Long> {

    List<ContratEnseignant> findByEnseignantId(Long enseignantId);

    List<ContratEnseignant> findByStatut(String statut);

    List<ContratEnseignant> findByEnseignantIdAndStatut(Long enseignantId, String statut);
}
