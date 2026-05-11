package com.schoolSys.schooolSys.appelparent;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppelParentRepository extends JpaRepository<AppelParent, Long> {

    List<AppelParent> findByEleveIdOrderByDateAppelDesc(Long eleveId);

    List<AppelParent> findAllByOrderByDateAppelDesc();
}
