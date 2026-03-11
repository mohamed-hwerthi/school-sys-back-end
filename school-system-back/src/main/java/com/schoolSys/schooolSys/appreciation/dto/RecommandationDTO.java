package com.schoolSys.schooolSys.appreciation.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommandationDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long domaineId;
    private String domaineName;
    private Integer trimestre;
    private String texte;
}
