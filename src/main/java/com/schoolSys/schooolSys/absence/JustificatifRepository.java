package com.schoolSys.schooolSys.absence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JustificatifRepository extends JpaRepository<Justificatif, Long> {

    List<Justificatif> findByAbsenceId(Long absenceId);
}
