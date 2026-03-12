package com.schoolSys.schooolSys.cantine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointageRepasDTO {
    private Long id;
    private Long eleveId;
    private LocalDate dateRepas;
    private String typeRepas;
    private Boolean present;
    private LocalDateTime createdAt;
}
