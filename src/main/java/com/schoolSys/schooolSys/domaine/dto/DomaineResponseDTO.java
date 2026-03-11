package com.schoolSys.schooolSys.domaine.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomaineResponseDTO {
    private Long id;
    private String name;
    private String nameAr;
    private Integer ordre;
    private Long niveauId;
    private String niveauName;
    private List<SousDomaineDTO> sousDomaines;
}
