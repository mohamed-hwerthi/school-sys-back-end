package com.schoolSys.schooolSys.bulletin.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulletinModuleDTO {
    private Long moduleId;
    private String moduleName;
    private Double coeff;
    private Integer ordre;
    private List<BulletinExamenDTO> examens;
    private Double moyenneModule;
    // class-level stats for this module
    private Double moduleMin;
    private Double moduleMax;
    private Double moduleClasseAvg;
}
