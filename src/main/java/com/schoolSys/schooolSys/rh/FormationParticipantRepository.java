package com.schoolSys.schooolSys.rh;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormationParticipantRepository extends JpaRepository<FormationParticipant, Long> {

    List<FormationParticipant> findByFormationId(Long formationId);

    List<FormationParticipant> findByEmployeId(Long employeId);

    boolean existsByFormationIdAndEmployeId(Long formationId, Long employeId);
}
