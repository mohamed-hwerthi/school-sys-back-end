package com.schoolSys.schooolSys.classroom;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data repository for {@link Classroom} entities.
 */
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
}
