package com.schoolSys.schooolSys.bulletin.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulletinDomaineDTO {
    private Long domaineId;
    private String domaineName;
    private String domaineNameAr;
    private Integer ordre;
    private List<BulletinModuleDTO> modules;
    private Double moyenneDomaine;
    private String recommandation;
}
