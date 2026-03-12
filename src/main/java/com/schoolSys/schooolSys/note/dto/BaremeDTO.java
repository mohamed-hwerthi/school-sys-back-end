package com.schoolSys.schooolSys.note.dto;

import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class BaremeDTO {
    private Long id;
    private String label;
    private BigDecimal noteMax;
    private BigDecimal noteMin;
    private BigDecimal notePassage;
    private Boolean actif;
}
