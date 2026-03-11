package com.schoolSys.schooolSys.course;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data repository for {@link Course} entities.
 */
public interface CourseRepository extends JpaRepository<Course, Long> {
}
