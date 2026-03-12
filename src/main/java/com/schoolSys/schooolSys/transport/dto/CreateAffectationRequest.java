package com.schoolSys.schooolSys.transport.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAffectationRequest {
    @NotNull
    private Long eleveId;
    @NotNull
    private Long circuitId;
    private Long arretId;
    @NotNull
    private String anneeScolaire;
}
