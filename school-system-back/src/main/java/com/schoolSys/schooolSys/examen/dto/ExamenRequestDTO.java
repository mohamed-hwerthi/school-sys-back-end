package com.schoolSys.schooolSys.examen.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExamenRequestDTO {

    @NotBlank(message = "Le nom de l'examen est obligatoire")
    private String name;

    private String namePrive;

    @NotNull
    @Builder.Default
    private Double coeffEtatique = 1.0;

    @NotNull
    @Builder.Default
    private Double coeffPrive = 1.0;

    @NotNull
    @Builder.Default
    private Integer ordreEtatique = 1;

    @NotNull
    @Builder.Default
    private Integer ordrePrive = 1;

    @NotNull(message = "La classe est obligatoire")
    private Long classeId;

    private Long teacherId;

    @NotNull(message = "Le module est obligatoire")
    private Long moduleId;

    @Builder.Default
    private Boolean versionEtatique = true;

    @Builder.Default
    private Boolean versionPrivee = true;
}
