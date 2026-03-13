package com.schoolSys.schooolSys.emploidutemps.solver;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.lookup.PlanningId;
import org.optaplanner.core.api.domain.variable.PlanningVariable;

@PlanningEntity
@Data
@NoArgsConstructor
public class PlanningLesson {

    @PlanningId
    private Long id;

    // Fixed facts
    private Long classeId;
    private Long moduleId;
    private Long enseignantId;
    private Double moduleCoefficient;

    // Planning variables (assigned by solver)
    @PlanningVariable(valueRangeProviderRefs = "timeslotRange")
    private PlanningTimeslot timeslot;

    @PlanningVariable(valueRangeProviderRefs = "roomRange")
    private PlanningRoom room;

    public PlanningLesson(Long id, Long classeId, Long moduleId, Long enseignantId, Double moduleCoefficient) {
        this.id = id;
        this.classeId = classeId;
        this.moduleId = moduleId;
        this.enseignantId = enseignantId;
        this.moduleCoefficient = moduleCoefficient;
    }
}
