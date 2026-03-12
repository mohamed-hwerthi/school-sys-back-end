package com.schoolSys.schooolSys.vitrine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitrineConfigDTO {

    private Long id;
    private String schoolDisplayName;
    private String slogan;
    private String logoUrl;
    private String heroImageUrl;
    private String primaryColor;
    private String secondaryColor;
    private String accentColor;
    private String themeTemplate;
    private String contactPhone;
    private String contactEmail;
    private String contactAddress;
    private String facebookUrl;
    private String instagramUrl;
    private String whatsappNumber;
    private String metaDescription;
    private boolean published;
}
