package com.schoolSys.schooolSys.anneescolaire.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VacanceDTO {
    private Long id;
    @NotBlank
    private String label;
    @NotNull
    private LocalDate dateDebut;
    @NotNull
    private LocalDate dateFin;
}
