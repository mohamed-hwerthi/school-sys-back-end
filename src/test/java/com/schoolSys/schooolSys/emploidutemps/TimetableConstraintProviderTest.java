package com.schoolSys.schooolSys.emploidutemps;

import com.schoolSys.schooolSys.emploidutemps.solver.*;
import org.junit.jupiter.api.Test;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import org.optaplanner.core.config.solver.SolverConfig;
import org.optaplanner.core.config.solver.termination.TerminationConfig;

import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TimetableConstraintProviderTest {

    private static final LocalTime T08 = LocalTime.of(8, 0);
    private static final LocalTime T09 = LocalTime.of(9, 0);
    private static final LocalTime T10 = LocalTime.of(10, 0);
    private static final LocalTime T11 = LocalTime.of(11, 0);
    private static final LocalTime T14 = LocalTime.of(14, 0);
    private static final LocalTime T15 = LocalTime.of(15, 0);

    private TimetableSolution solve(TimetableSolution problem, int timeoutSeconds) {
        SolverConfig config = new SolverConfig()
            .withSolutionClass(TimetableSolution.class)
            .withEntityClasses(PlanningLesson.class)
            .withConstraintProviderClass(TimetableConstraintProvider.class)
            .withTerminationConfig(new TerminationConfig()
                .withSpentLimit(Duration.ofSeconds(timeoutSeconds)));

        SolverFactory<TimetableSolution> factory = SolverFactory.create(config);
        Solver<TimetableSolution> solver = factory.buildSolver();
        return solver.solve(problem);
    }

    @Test
    void solverFindsValidSolution_noHardViolations() {
        // 2 days x 3 creneaux = 6 timeslots
        List<PlanningTimeslot> timeslots = List.of(
            new PlanningTimeslot(1L, 1L, 1, T08, T09),
            new PlanningTimeslot(2L, 2L, 1, T09, T10),
            new PlanningTimeslot(3L, 3L, 1, T10, T11),
            new PlanningTimeslot(4L, 1L, 2, T08, T09),
            new PlanningTimeslot(5L, 2L, 2, T09, T10),
            new PlanningTimeslot(6L, 3L, 2, T10, T11)
        );

        List<PlanningRoom> rooms = List.of(
            new PlanningRoom(1L, "Salle A1"),
            new PlanningRoom(2L, "Salle A2")
        );

        // 4 lessons: 2 classes, 2 modules, 2 teachers
        List<PlanningLesson> lessons = new ArrayList<>();
        lessons.add(new PlanningLesson(1L, 1L, 10L, 100L, 2.0));
        lessons.add(new PlanningLesson(2L, 1L, 11L, 101L, 1.0));
        lessons.add(new PlanningLesson(3L, 2L, 10L, 100L, 2.0));
        lessons.add(new PlanningLesson(4L, 2L, 11L, 102L, 1.0));

        TimetableSolution problem = new TimetableSolution(timeslots, rooms, lessons);
        TimetableSolution solution = solve(problem, 5);

        assertNotNull(solution.getScore());
        assertTrue(solution.getScore().hardScore() >= 0,
            "Solver should find a solution with no hard constraint violations, but got: " + solution.getScore());

        // Verify all lessons are assigned
        for (PlanningLesson lesson : solution.getLessons()) {
            assertNotNull(lesson.getTimeslot(), "Every lesson should have a timeslot assigned");
            assertNotNull(lesson.getRoom(), "Every lesson should have a room assigned");
        }
    }

    @Test
    void solverRespects_roomConflict() {
        // 1 timeslot, 1 room, 2 lessons → impossible to avoid room conflict
        List<PlanningTimeslot> timeslots = List.of(
            new PlanningTimeslot(1L, 1L, 1, T08, T09)
        );
        List<PlanningRoom> rooms = List.of(
            new PlanningRoom(1L, "Salle A1")
        );
        List<PlanningLesson> lessons = new ArrayList<>();
        lessons.add(new PlanningLesson(1L, 1L, 10L, 100L, 1.0));
        lessons.add(new PlanningLesson(2L, 2L, 11L, 101L, 1.0));

        TimetableSolution problem = new TimetableSolution(timeslots, rooms, lessons);
        TimetableSolution solution = solve(problem, 5);

        // With 1 timeslot and 1 room, 2 lessons must conflict
        assertTrue(solution.getScore().hardScore() < 0,
            "With only 1 timeslot and 1 room, 2 lessons must cause a hard constraint violation");
    }

    @Test
    void solverRespects_teacherConflict() {
        // 2 timeslots, 2 rooms, but same teacher for both lessons
        // Solver should find a solution by assigning different timeslots
        List<PlanningTimeslot> timeslots = List.of(
            new PlanningTimeslot(1L, 1L, 1, T08, T09),
            new PlanningTimeslot(2L, 2L, 1, T09, T10)
        );
        List<PlanningRoom> rooms = List.of(
            new PlanningRoom(1L, "Salle A1"),
            new PlanningRoom(2L, "Salle A2")
        );
        // Same teacher (100) for both lessons
        List<PlanningLesson> lessons = new ArrayList<>();
        lessons.add(new PlanningLesson(1L, 1L, 10L, 100L, 1.0));
        lessons.add(new PlanningLesson(2L, 2L, 11L, 100L, 1.0));

        TimetableSolution problem = new TimetableSolution(timeslots, rooms, lessons);
        TimetableSolution solution = solve(problem, 5);

        assertTrue(solution.getScore().hardScore() >= 0,
            "Solver should separate same-teacher lessons into different timeslots");

        // Verify different timeslots for same teacher
        PlanningLesson l1 = solution.getLessons().get(0);
        PlanningLesson l2 = solution.getLessons().get(1);
        assertNotEquals(l1.getTimeslot(), l2.getTimeslot(),
            "Same teacher should not be in the same timeslot");
    }

    @Test
    void solverRespects_classConflict() {
        // 2 timeslots, 2 rooms, same class for both lessons
        List<PlanningTimeslot> timeslots = List.of(
            new PlanningTimeslot(1L, 1L, 1, T08, T09),
            new PlanningTimeslot(2L, 2L, 1, T09, T10)
        );
        List<PlanningRoom> rooms = List.of(
            new PlanningRoom(1L, "Salle A1"),
            new PlanningRoom(2L, "Salle A2")
        );
        // Same class (1L) for both lessons
        List<PlanningLesson> lessons = new ArrayList<>();
        lessons.add(new PlanningLesson(1L, 1L, 10L, 100L, 1.0));
        lessons.add(new PlanningLesson(2L, 1L, 11L, 101L, 1.0));

        TimetableSolution problem = new TimetableSolution(timeslots, rooms, lessons);
        TimetableSolution solution = solve(problem, 5);

        assertTrue(solution.getScore().hardScore() >= 0,
            "Solver should separate same-class lessons into different timeslots");

        PlanningLesson l1 = solution.getLessons().get(0);
        PlanningLesson l2 = solution.getLessons().get(1);
        assertNotEquals(l1.getTimeslot(), l2.getTimeslot(),
            "Same class should not have two lessons at the same timeslot");
    }
}
