package com.schoolSys.schooolSys.appreciation.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObservationDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Integer trimestre;
    private String comportement;
    private String certificatType;
}
