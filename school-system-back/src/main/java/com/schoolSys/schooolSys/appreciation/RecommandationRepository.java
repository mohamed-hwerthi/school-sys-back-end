package com.schoolSys.schooolSys.appreciation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecommandationRepository extends JpaRepository<Recommandation, Long> {

    List<Recommandation> findByStudentIdInAndTrimestre(List<Long> studentIds, Integer trimestre);

    Optional<Recommandation> findByStudentIdAndDomaineIdAndTrimestre(
            Long studentId, Long domaineId, Integer trimestre);
}
