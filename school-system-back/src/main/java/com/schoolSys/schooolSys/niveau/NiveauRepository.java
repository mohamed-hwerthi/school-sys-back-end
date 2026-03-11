package com.schoolSys.schooolSys.niveau;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NiveauRepository extends JpaRepository<Niveau, Long> {

    boolean existsByName(String name);

    Optional<Niveau> findByName(String name);
}
