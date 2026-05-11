package com.schoolSys.schooolSys.affectation.dto;

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
public class AffectationRequestDTO {

    @NotNull
    private Long teacherId;

    @NotNull
    private Long classeId;

    /** Nullable: prof principal sans matière dédiée. */
    private Long moduleId;

    @NotNull
    private String anneeScolaire;

    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String notes;
}
