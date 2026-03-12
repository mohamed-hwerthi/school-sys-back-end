package com.schoolSys.schooolSys.devoir.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRessourceRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String titre;

    private String description;

    private Long moduleId;

    @Builder.Default
    private String type = "DOCUMENT";

    private String fichierUrl;

    private String lienExterne;

    private Long enseignantId;

    private Long tailleFichier;
}
