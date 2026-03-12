package com.schoolSys.schooolSys.devoir.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RessourceDTO {

    private Long id;
    private String titre;
    private String description;
    private Long moduleId;
    private String type;
    private String fichierUrl;
    private String lienExterne;
    private Long enseignantId;
    private Long tailleFichier;
    private LocalDateTime createdAt;
}
