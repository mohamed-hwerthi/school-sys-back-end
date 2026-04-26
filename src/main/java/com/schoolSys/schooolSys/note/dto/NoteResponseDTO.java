package com.schoolSys.schooolSys.note.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteResponseDTO {

    private Long id;
    private Long studentId;
    private String studentName;
    private Long examenId;
    private String examenName;
    private Integer trimestre;
    private Double valeur;
    private String observation;
    private String statut;
}
