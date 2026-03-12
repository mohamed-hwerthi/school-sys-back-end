package com.schoolSys.schooolSys.facture;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {

    Optional<Facture> findByNumero(String numero);

    List<Facture> findByStudentId(Long studentId);

    List<Facture> findByStatut(String statut);

    List<Facture> findByStudentIdAndStatut(Long studentId, String statut);
}
