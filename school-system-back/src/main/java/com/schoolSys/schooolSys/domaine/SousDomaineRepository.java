package com.schoolSys.schooolSys.domaine;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SousDomaineRepository extends JpaRepository<SousDomaine, Long> {

    List<SousDomaine> findByDomaineIdOrderByOrdreAsc(Long domaineId);
}
