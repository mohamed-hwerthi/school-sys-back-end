package com.schoolSys.schooolSys.module.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ModuleResponseDTO {

    private Long id;
    private String name;
    private String nameVp;
    private String nameAr;
    private Double coeffEtatique;
    private Double coeffPrive;
    private Integer ordreEtatique;
    private Integer ordrePrive;
    private Long niveauId;
    private String niveauName;
    private Long domaineId;
    private String domaineName;
    private Long sousDomaineId;
    private String sousDomaineName;
    private Boolean versionEtatique;
    private Boolean versionPrivee;
}
