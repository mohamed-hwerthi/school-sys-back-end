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
public class QuizDetailDTO {

    private Long id;
    private String titre;
    private String description;
    private Long moduleId;
    private Long classeId;
    private Long enseignantId;
    private Integer dureeMinutes;
    private BigDecimal noteTotale;
    private Boolean melangerQuestions;
    private Boolean melangerReponses;
    private Boolean afficherResultats;
    private Integer tentativesMax;
    private LocalDateTime dateDebut;
    private LocalDateTime dateFin;
    private String statut;
    private List<QuestionDTO> questions;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
