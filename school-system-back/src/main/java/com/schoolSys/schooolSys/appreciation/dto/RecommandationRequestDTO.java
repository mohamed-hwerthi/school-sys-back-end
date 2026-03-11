package com.schoolSys.schooolSys.appreciation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommandationRequestDTO {

    @NotNull
    private Long studentId;

    @NotNull
    private Long domaineId;

    @NotNull
    private Integer trimestre;

    private String texte;
}
