package com.schoolSys.schooolSys.bulletin.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BulletinExamenDTO {
    private Long examenId;
    private String examenName;
    private Double coeff;
    private Double note;
}
