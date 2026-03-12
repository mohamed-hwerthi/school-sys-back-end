package com.schoolSys.schooolSys.examenonline.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TentativeDTO {

    private Long id;
    private Long quizId;
    private String quizTitre;
    private Long eleveId;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private BigDecimal score;
    private BigDecimal scorePourcentage;
    private String statut;
    private Integer tempsPasseSecondes;
    private List<ReponseEleveDTO> reponses;
    private LocalDateTime createdAt;
}
