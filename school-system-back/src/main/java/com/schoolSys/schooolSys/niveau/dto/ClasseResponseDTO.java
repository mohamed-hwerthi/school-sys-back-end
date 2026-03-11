package com.schoolSys.schooolSys.niveau.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClasseResponseDTO {
    private Long id;
    private String letter;
    private Long niveauId;
    private String niveauName;
    private String fullName;
}
