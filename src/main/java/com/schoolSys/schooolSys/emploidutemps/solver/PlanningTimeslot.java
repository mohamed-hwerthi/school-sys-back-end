package com.schoolSys.schooolSys.emploidutemps.solver;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanningTimeslot {

    private Long id;
    private Long creneauId;
    private Integer jourSemaine; // 1=Monday ... 6=Saturday
    private LocalTime heureDebut;
    private LocalTime heureFin;

    public String getDayAndTime() {
        return jourSemaine + "-" + heureDebut;
    }
}
