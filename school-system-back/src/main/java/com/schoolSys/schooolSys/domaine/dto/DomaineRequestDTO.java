package com.schoolSys.schooolSys.domaine.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomaineRequestDTO {

    @NotBlank(message = "Le nom du domaine est obligatoire")
    private String name;

    private String nameAr;

    @NotNull
    @Builder.Default
    private Integer ordre = 1;

    @NotNull(message = "Le niveau est obligatoire")
    private Long niveauId;
}
