package com.schoolSys.schooolSys.niveau;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClasseRepository extends JpaRepository<Classe, Long> {
    List<Classe> findByNiveauId(Long niveauId);
}
