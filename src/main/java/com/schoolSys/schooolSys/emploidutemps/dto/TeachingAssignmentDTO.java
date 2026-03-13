package com.schoolSys.schooolSys.emploidutemps.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeachingAssignmentDTO {

    @NotNull
    private Long classeId;

    @NotNull
    private Long moduleId;

    @NotNull
    private Long enseignantId;

    @NotNull
    @Min(1)
    private Integer nbHeures;
}
