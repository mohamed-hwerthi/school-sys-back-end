package com.schoolSys.schooolSys.note;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, UUID> {

    List<Note> findByExamenIdAndTrimestre(UUID examenId, Integer trimestre);

    List<Note> findByStudentIdAndTrimestre(UUID studentId, Integer trimestre);

    Optional<Note> findByStudentIdAndExamenIdAndTrimestre(UUID studentId, UUID examenId, Integer trimestre);

    List<Note> findByExamenClasseIdAndTrimestre(UUID classeId, Integer trimestre);

    long countByExamenIdAndTrimestre(UUID examenId, Integer trimestre);
}
