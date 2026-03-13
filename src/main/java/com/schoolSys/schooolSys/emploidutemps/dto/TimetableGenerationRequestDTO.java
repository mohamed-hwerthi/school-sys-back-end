package com.schoolSys.schooolSys.emploidutemps.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimetableGenerationRequestDTO {

    @NotEmpty
    @Valid
    private List<TeachingAssignmentDTO> assignments;

    @NotEmpty
    private List<String> rooms;

    @Builder.Default
    private Integer solverTimeoutSeconds = 30;
}
