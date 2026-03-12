package com.schoolSys.schooolSys.vitrine;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vitrine_page_views")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitrinePageView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_slug", nullable = false)
    private String pageSlug;

    @Column(name = "visitor_hash")
    private String visitorHash;

    @Column(name = "user_agent")
    private String userAgent;

    private String referer;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
