package com.schoolSys.schooolSys.affectation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AffectationDTO {

    private Long id;

    private Long teacherId;
    private String teacherName;

    private Long classeId;
    private String classeName;

    private Long moduleId;
    private String moduleName;

    private String anneeScolaire;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String notes;
}
