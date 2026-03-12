package com.schoolSys.schooolSys.rh;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PointagePersonnelRepository extends JpaRepository<PointagePersonnel, Long> {

    List<PointagePersonnel> findByDatePointage(LocalDate date);

    List<PointagePersonnel> findByEmployeIdAndEmployeType(Long employeId, String employeType);

    List<PointagePersonnel> findByEmployeIdAndDatePointageBetween(Long employeId, LocalDate start, LocalDate end);

    List<PointagePersonnel> findByDatePointageBetween(LocalDate start, LocalDate end);

    long countByDatePointageAndStatut(LocalDate date, String statut);
}
