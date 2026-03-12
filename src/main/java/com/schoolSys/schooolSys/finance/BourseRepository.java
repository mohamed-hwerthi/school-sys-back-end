package com.schoolSys.schooolSys.finance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BourseRepository extends JpaRepository<Bourse, Long> {

    List<Bourse> findByAnneeScolaire(String anneeScolaire);

    List<Bourse> findByStudentId(Long studentId);

    List<Bourse> findByStudentIdAndAnneeScolaire(Long studentId, String anneeScolaire);
}
