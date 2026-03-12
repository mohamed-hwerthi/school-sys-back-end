package com.schoolSys.schooolSys.student.dto;

import lombok.Data;

import java.util.List;

@Data
public class ReinscriptionRequestDTO {
    private List<Long> studentIds;
    private String newClasse;
    private String newNiveau;
}
