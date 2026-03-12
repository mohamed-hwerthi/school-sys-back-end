package com.schoolSys.schooolSys.rh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FormationParticipantDTO {
    private Long id;
    private Long formationId;
    private Long employeId;
    private String employeType;
    private Boolean present;
    private Boolean certificatObtenu;
}
