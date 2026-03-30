package com.schoolSys.schooolSys.meeting;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {

    List<Meeting> findByEnseignantIdOrderByDateAscHeureDebutAsc(Long enseignantId);

    List<Meeting> findByParentIdOrderByDateAscHeureDebutAsc(Long parentId);

    List<Meeting> findByStudentIdOrderByDateAscHeureDebutAsc(Long studentId);

    List<Meeting> findByDateBetweenOrderByDateAscHeureDebutAsc(LocalDate start, LocalDate end);

    List<Meeting> findByStatutOrderByDateAscHeureDebutAsc(String statut);

    List<Meeting> findAllByOrderByDateAscHeureDebutAsc();
}
