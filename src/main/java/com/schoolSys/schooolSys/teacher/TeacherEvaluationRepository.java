package com.schoolSys.schooolSys.teacher;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeacherEvaluationRepository extends JpaRepository<TeacherEvaluation, Long> {

    List<TeacherEvaluation> findByTeacherId(Long teacherId);

    List<TeacherEvaluation> findByTeacherIdAndAnneeScolaire(Long teacherId, String anneeScolaire);

    List<TeacherEvaluation> findByTeacherIdOrderByCreatedAtDesc(Long teacherId);

    List<TeacherEvaluation> findByAnneeScolaire(String anneeScolaire);
}
