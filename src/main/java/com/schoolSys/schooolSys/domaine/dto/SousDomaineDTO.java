package com.schoolSys.schooolSys.domaine.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SousDomaineDTO {
    private Long id;
    private String name;
    private String nameAr;
    private Integer ordre;
    private Long domaineId;
}
