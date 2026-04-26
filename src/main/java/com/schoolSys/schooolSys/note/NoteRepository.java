package com.schoolSys.schooolSys.note;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByExamenIdAndTrimestre(Long examenId, Integer trimestre);

    List<Note> findByStudentIdAndTrimestre(Long studentId, Integer trimestre);

    Optional<Note> findByStudentIdAndExamenIdAndTrimestre(Long studentId, Long examenId, Integer trimestre);

    List<Note> findByExamenClasseIdAndTrimestre(Long classeId, Integer trimestre);

    long countByExamenIdAndTrimestre(Long examenId, Integer trimestre);
}
