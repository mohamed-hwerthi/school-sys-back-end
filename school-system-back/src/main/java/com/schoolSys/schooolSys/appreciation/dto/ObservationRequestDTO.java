package com.schoolSys.schooolSys.appreciation.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ObservationRequestDTO {

    @NotNull
    private Long studentId;

    @NotNull
    private Integer trimestre;

    private String comportement;

    private String certificatType;
}
