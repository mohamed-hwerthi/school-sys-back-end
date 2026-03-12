package com.schoolSys.schooolSys.rh.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddParticipantRequest {
    @NotNull
    private Long employeId;
    @NotNull
    private String employeType;
    private Boolean present;
    private Boolean certificatObtenu;
}
