package com.schoolSys.schooolSys.student;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentEleveRepository extends JpaRepository<DocumentEleve, Long> {
    List<DocumentEleve> findByStudentIdOrderByUploadedAtDesc(Long studentId);
}
