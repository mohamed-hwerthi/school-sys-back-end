package com.schoolSys.schooolSys.rh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointageDTO {
    private Long id;
    private Long employeId;
    private String employeType;
    private LocalDate datePointage;
    private LocalTime heureArrivee;
    private LocalTime heureDepart;
    private BigDecimal heuresTravaillees;
    private String statut;
    private String notes;
    private LocalDateTime createdAt;
}
