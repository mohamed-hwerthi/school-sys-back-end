package com.schoolSys.schooolSys.examenonline.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReponseEleveDTO {

    private Long id;
    private Long tentativeId;
    private Long questionId;
    private String questionTexte;
    private Long choixId;
    private String reponseTexte;
    private Boolean correct;
    private BigDecimal pointsObtenus;
}
