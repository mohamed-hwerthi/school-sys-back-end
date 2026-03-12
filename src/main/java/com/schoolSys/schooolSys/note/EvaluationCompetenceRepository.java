package com.schoolSys.schooolSys.note;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvaluationCompetenceRepository extends JpaRepository<EvaluationCompetence, Long> {
    List<EvaluationCompetence> findByEleveIdAndExamenId(Long eleveId, Long examenId);
    List<EvaluationCompetence> findByExamenId(Long examenId);
}
