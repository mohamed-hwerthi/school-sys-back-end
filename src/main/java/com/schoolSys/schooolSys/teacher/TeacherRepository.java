package com.schoolSys.schooolSys.teacher;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data repository for {@link Teacher} entities.
 */
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
}
