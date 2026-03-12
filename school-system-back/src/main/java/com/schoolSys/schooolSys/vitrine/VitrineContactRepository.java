package com.schoolSys.schooolSys.vitrine;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VitrineContactRepository extends JpaRepository<VitrineContact, Long> {

    List<VitrineContact> findAllByOrderByCreatedAtDesc();

    long countByIsReadFalse();
}
