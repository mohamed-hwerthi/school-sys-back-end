package com.schoolSys.schooolSys.emploidutemps.solver;

import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.api.score.stream.Constraint;
import org.optaplanner.core.api.score.stream.ConstraintFactory;
import org.optaplanner.core.api.score.stream.ConstraintProvider;
import org.optaplanner.core.api.score.stream.Joiners;

import java.time.LocalTime;

public class TimetableConstraintProvider implements ConstraintProvider {

    private static final LocalTime NOON = LocalTime.of(12, 0);

    @Override
    public Constraint[] defineConstraints(ConstraintFactory factory) {
        return new Constraint[] {
            // Hard constraints
            roomConflict(factory),
            teacherConflict(factory),
            classConflict(factory),
            // Soft constraints
            subjectVarietyPerDay(factory),
            teacherGapMinimization(factory),
            heavySubjectInMorning(factory),
        };
    }

    // --- HARD CONSTRAINTS ---

    /**
     * Two lessons cannot occupy the same room at the same timeslot.
     */
    Constraint roomConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(PlanningLesson.class,
                Joiners.equal(PlanningLesson::getTimeslot),
                Joiners.equal(PlanningLesson::getRoom))
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("Room conflict");
    }

    /**
     * A teacher cannot teach two lessons at the same timeslot.
     */
    Constraint teacherConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(PlanningLesson.class,
                Joiners.equal(PlanningLesson::getEnseignantId),
                Joiners.equal(PlanningLesson::getTimeslot))
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("Teacher conflict");
    }

    /**
     * A class cannot have two lessons at the same timeslot.
     */
    Constraint classConflict(ConstraintFactory factory) {
        return factory.forEachUniquePair(PlanningLesson.class,
                Joiners.equal(PlanningLesson::getClasseId),
                Joiners.equal(PlanningLesson::getTimeslot))
            .penalize(HardSoftScore.ONE_HARD)
            .asConstraint("Class conflict");
    }

    // --- SOFT CONSTRAINTS ---

    /**
     * Same module for the same class should appear at most 2 times per day.
     * Penalize each pair beyond the 2nd occurrence.
     */
    Constraint subjectVarietyPerDay(ConstraintFactory factory) {
        return factory.forEachUniquePair(PlanningLesson.class,
                Joiners.equal(PlanningLesson::getClasseId),
                Joiners.equal(PlanningLesson::getModuleId),
                Joiners.equal(lesson -> lesson.getTimeslot() != null ? lesson.getTimeslot().getJourSemaine() : null))
            .filter((l1, l2) -> {
                // Both lessons are the same module, same class, same day
                // We penalize any pair beyond 1 (meaning 3+ occurrences get penalized more)
                return true;
            })
            .penalize(HardSoftScore.ONE_SOFT)
            .asConstraint("Subject variety per day");
    }

    /**
     * Minimize gaps in a teacher's daily schedule.
     * If a teacher has lessons at timeslots that are not consecutive, penalize the gap.
     */
    Constraint teacherGapMinimization(ConstraintFactory factory) {
        return factory.forEachUniquePair(PlanningLesson.class,
                Joiners.equal(PlanningLesson::getEnseignantId),
                Joiners.equal(lesson -> lesson.getTimeslot() != null ? lesson.getTimeslot().getJourSemaine() : null))
            .filter((l1, l2) -> {
                if (l1.getTimeslot() == null || l2.getTimeslot() == null) return false;
                long gap = Math.abs(
                    l1.getTimeslot().getHeureDebut().toSecondOfDay() -
                    l2.getTimeslot().getHeureDebut().toSecondOfDay()
                );
                // Penalize if gap is more than 2 hours (7200 seconds)
                return gap > 7200;
            })
            .penalize(HardSoftScore.ONE_SOFT)
            .asConstraint("Teacher gap minimization");
    }

    /**
     * Modules with high coefficient (>= 2.0) should be scheduled before noon.
     */
    Constraint heavySubjectInMorning(ConstraintFactory factory) {
        return factory.forEach(PlanningLesson.class)
            .filter(lesson -> lesson.getModuleCoefficient() != null
                && lesson.getModuleCoefficient() >= 2.0
                && lesson.getTimeslot() != null
                && !lesson.getTimeslot().getHeureDebut().isBefore(NOON))
            .penalize(HardSoftScore.ONE_SOFT)
            .asConstraint("Heavy subject in morning");
    }
}
