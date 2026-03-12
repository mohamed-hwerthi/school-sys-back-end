package com.schoolSys.schooolSys.note;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BaremeRepository extends JpaRepository<Bareme, Long> {
    Optional<Bareme> findByActifTrue();
}
