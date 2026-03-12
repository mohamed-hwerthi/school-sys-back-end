package com.schoolSys.schooolSys.absence.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AbsenceRequestDTO {
    @NotNull
    private Long eleveId;
    @NotNull
    private LocalDate date;
    @NotNull
    private String type; // ABSENCE or RETARD
    private String seance;
    private LocalTime heureArrivee;
    private Boolean justifie;
    private String motif;
    private Long enseignantId;
}
