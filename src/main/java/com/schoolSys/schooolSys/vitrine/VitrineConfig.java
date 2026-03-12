package com.schoolSys.schooolSys.vitrine;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vitrine_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitrineConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "school_display_name")
    private String schoolDisplayName;

    private String slogan;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "hero_image_url")
    private String heroImageUrl;

    @Builder.Default
    @Column(name = "primary_color", nullable = false)
    private String primaryColor = "#1e40af";

    @Builder.Default
    @Column(name = "secondary_color", nullable = false)
    private String secondaryColor = "#f59e0b";

    @Builder.Default
    @Column(name = "accent_color", nullable = false)
    private String accentColor = "#10b981";

    @Builder.Default
    @Column(name = "theme_template", nullable = false)
    private String themeTemplate = "modern";

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_address")
    private String contactAddress;

    @Column(name = "facebook_url")
    private String facebookUrl;

    @Column(name = "instagram_url")
    private String instagramUrl;

    @Column(name = "whatsapp_number")
    private String whatsappNumber;

    @Column(name = "meta_description")
    private String metaDescription;

    @Builder.Default
    @Column(name = "is_published", nullable = false)
    private boolean published = false;

    @Builder.Default
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
