package com.schoolSys.schooolSys.vitrine;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface VitrineAnnouncementRepository extends JpaRepository<VitrineAnnouncement, Long> {

    List<VitrineAnnouncement> findByPublishedTrueAndExpiresAtIsNullOrExpiresAtAfterOrderByPinnedDescCreatedAtDesc(LocalDateTime now);

    List<VitrineAnnouncement> findAllByOrderByPinnedDescCreatedAtDesc();
}
