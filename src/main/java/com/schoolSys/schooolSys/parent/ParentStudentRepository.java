package com.schoolSys.schooolSys.parent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParentStudentRepository extends JpaRepository<ParentStudent, Long> {

    List<ParentStudent> findByParentUserId(Long parentUserId);

    List<ParentStudent> findByStudentId(Long studentId);
}
