package com.schoolSys.schooolSys.note;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompetenceRepository extends JpaRepository<Competence, Long> {
    List<Competence> findByModuleId(Long moduleId);
}
