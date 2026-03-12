package com.schoolSys.schooolSys.examenonline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByQuizIdOrderByOrdreAsc(Long quizId);

    long countByQuizId(Long quizId);
}
