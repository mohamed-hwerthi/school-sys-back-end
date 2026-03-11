package com.schoolSys.schooolSys.module.dto;

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
public class ModuleRequestDTO {

    @NotBlank(message = "Le nom du module est obligatoire")
    private String name;

    private String nameVp;

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

    @NotNull(message = "Le niveau est obligatoire")
    private Long niveauId;

    private Long domaineId;

    private Long sousDomaineId;

    @Builder.Default
    private Boolean versionEtatique = true;

    @Builder.Default
    private Boolean versionPrivee = true;
}
