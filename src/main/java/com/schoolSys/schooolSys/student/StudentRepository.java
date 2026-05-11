package com.schoolSys.schooolSys.student;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long>, JpaSpecificationExecutor<Student> {
    long countByClasse(String classe);
    boolean existsByMatricule(String matricule);
    Optional<Student> findByMatricule(String matricule);
    boolean existsByRegistrationNumber(String registrationNumber);
    boolean existsByEmail(String email);
}
