package com.schoolSys.schooolSys.facture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EcheanceRepository extends JpaRepository<Echeance, Long> {

    List<Echeance> findByEcheancierId(Long echeancierId);

    List<Echeance> findByStatut(String statut);
}
