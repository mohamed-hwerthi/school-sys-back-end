package com.schoolSys.schooolSys.note.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoyenneDTO {

    private Long studentId;
    private String studentName;
    private Integer trimestre;
    private Map<String, Double> moyennesParModule;
    private Double moyenneGenerale;
}
