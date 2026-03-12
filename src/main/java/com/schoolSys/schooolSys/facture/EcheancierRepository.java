package com.schoolSys.schooolSys.facture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EcheancierRepository extends JpaRepository<Echeancier, Long> {

    List<Echeancier> findByStudentId(Long studentId);

    List<Echeancier> findByAnneeScolaire(String anneeScolaire);

    List<Echeancier> findByStudentIdAndAnneeScolaire(Long studentId, String anneeScolaire);
}
