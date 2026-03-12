package com.schoolSys.schooolSys.vitrine;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VitrineGalleryRepository extends JpaRepository<VitrineGallery, Long> {

    List<VitrineGallery> findAllByOrderByDisplayOrderAsc();
}
