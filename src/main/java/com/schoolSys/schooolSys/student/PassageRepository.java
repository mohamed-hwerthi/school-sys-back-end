package com.schoolSys.schooolSys.student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PassageRepository extends JpaRepository<Passage, Long> {

    List<Passage> findByAnneeScolaire(String anneeScolaire);

    List<Passage> findByStudentId(Long studentId);

    List<Passage> findByStudentIdOrderByCreatedAtDesc(Long studentId);

    List<Passage> findByAnneeScolaireAndDecision(String anneeScolaire, String decision);
}
