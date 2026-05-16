package com.schoolSys.schooolSys.scolarite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScolariteRepository extends JpaRepository<Scolarite, Long> {

    List<Scolarite> findByStudentIdOrderByAnneeScolaireDesc(Long studentId);

    List<Scolarite> findByAnneeScolaire(String anneeScolaire);

    Optional<Scolarite> findByStudentIdAndAnneeScolaire(Long studentId, String anneeScolaire);

    boolean existsByStudentIdAndAnneeScolaire(Long studentId, String anneeScolaire);
}
