package com.schoolSys.schooolSys.teacher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherEvaluationDTO {

    private Long id;
    private Long teacherId;
    private String teacherName;
    private Long evaluatorId;
    private String evaluatorName;
    private String anneeScolaire;
    private Integer trimestre;
    private Integer ponctualite;
    private Integer pedagogie;
    private Integer discipline;
    private Integer communication;
    private Integer implication;
    private BigDecimal noteGlobale;
    private String commentaire;
    private String createdAt;
}
