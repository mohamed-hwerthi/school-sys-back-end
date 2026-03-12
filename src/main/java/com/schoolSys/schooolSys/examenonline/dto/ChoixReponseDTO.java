package com.schoolSys.schooolSys.examenonline.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChoixReponseDTO {

    private Long id;
    private String texte;
    private Boolean correct;
    private Integer ordre;
}
