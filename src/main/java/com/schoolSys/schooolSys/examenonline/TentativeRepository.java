package com.schoolSys.schooolSys.examenonline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TentativeRepository extends JpaRepository<Tentative, Long> {

    List<Tentative> findByQuizIdOrderByDateDebutDesc(Long quizId);

    List<Tentative> findByEleveIdOrderByDateDebutDesc(Long eleveId);

    List<Tentative> findByQuizIdAndEleveId(Long quizId, Long eleveId);

    long countByQuizId(Long quizId);

    long countByQuizIdAndStatut(Long quizId, String statut);
}
