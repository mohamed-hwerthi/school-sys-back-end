package com.schoolSys.schooolSys.examen.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamenResponseDTO {

    private Long id;
    private String name;
    private String namePrive;
    private Double coeffEtatique;
    private Double coeffPrive;
    private Integer ordreEtatique;
    private Integer ordrePrive;
    private Integer trimestre;
    private Long classeId;
    private String classeName;
    private Long teacherId;
    private String teacherName;
    private Long moduleId;
    private String moduleName;
    private Boolean versionEtatique;
    private Boolean versionPrivee;
    private Long nbNotes;
    private Long nbEleves;
}
