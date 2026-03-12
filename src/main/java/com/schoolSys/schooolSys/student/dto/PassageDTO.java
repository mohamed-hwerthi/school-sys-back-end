package com.schoolSys.schooolSys.student.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PassageDTO {

    private Long id;
    private Long studentId;
    private String studentName;
    private String ancienNiveau;
    private String nouveauNiveau;
    private String ancienneClasse;
    private String nouvelleClasse;
    private String decision;
    private String anneeScolaire;
    private String motif;
    private String createdAt;
}
