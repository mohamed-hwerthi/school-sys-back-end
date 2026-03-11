package com.schoolSys.schooolSys.appreciation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ObservationRepository extends JpaRepository<ObservationTrimestre, Long> {

    List<ObservationTrimestre> findByStudentIdInAndTrimestre(List<Long> studentIds, Integer trimestre);

    Optional<ObservationTrimestre> findByStudentIdAndTrimestre(Long studentId, Integer trimestre);
}
