package com.schoolSys.schooolSys.finance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TypeFraisRepository extends JpaRepository<TypeFrais, Long> {

    List<TypeFrais> findByActifTrue();
}
