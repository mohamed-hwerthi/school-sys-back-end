package com.schoolSys.schooolSys.devoir.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateSoumissionRequest {

    @NotNull(message = "Le devoir est obligatoire")
    private Long devoirId;

    @NotNull(message = "L'eleve est obligatoire")
    private Long eleveId;

    private String contenu;

    private String fichierUrl;
}
