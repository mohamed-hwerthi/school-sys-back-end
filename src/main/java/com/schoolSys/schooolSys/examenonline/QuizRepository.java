package com.schoolSys.schooolSys.examenonline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByClasseIdOrderByCreatedAtDesc(Long classeId);

    List<Quiz> findByModuleIdOrderByCreatedAtDesc(Long moduleId);

    List<Quiz> findByStatutOrderByCreatedAtDesc(String statut);

    List<Quiz> findByEnseignantIdOrderByCreatedAtDesc(Long enseignantId);

    List<Quiz> findAllByOrderByCreatedAtDesc();
}
