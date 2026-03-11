package com.schoolSys.schooolSys.domaine;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DomaineRepository extends JpaRepository<Domaine, Long> {

    List<Domaine> findByNiveauIdOrderByOrdreAsc(Long niveauId);

    List<Domaine> findAllByOrderByNiveauNameAscOrdreAsc();
}
