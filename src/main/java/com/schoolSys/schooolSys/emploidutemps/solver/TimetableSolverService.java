package com.schoolSys.schooolSys.emploidutemps.solver;

import com.schoolSys.schooolSys.emploidutemps.Creneau;
import com.schoolSys.schooolSys.emploidutemps.CreneauRepository;
import com.schoolSys.schooolSys.emploidutemps.EmploiDuTemps;
import com.schoolSys.schooolSys.emploidutemps.EmploiDuTempsRepository;
import com.schoolSys.schooolSys.emploidutemps.dto.*;
import com.schoolSys.schooolSys.module.Module;
import com.schoolSys.schooolSys.module.ModuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import org.optaplanner.core.config.solver.SolverConfig;
import org.optaplanner.core.config.solver.termination.TerminationConfig;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TimetableSolverService {

    private final CreneauRepository creneauRepository;
    private final EmploiDuTempsRepository emploiDuTempsRepository;
    private final ModuleRepository moduleRepository;

    @Transactional
    public TimetableGenerationResponseDTO generate(TimetableGenerationRequestDTO request) {
        // 1. Load creneaux of type COURS from DB
        List<Creneau> courseCreneaux = creneauRepository.findByType("COURS");
        if (courseCreneaux.isEmpty()) {
            return TimetableGenerationResponseDTO.builder()
                .status("INFEASIBLE")
                .score("N/A")
                .entries(Collections.emptyList())
                .unresolvedConflicts(List.of("Aucun creneau de type COURS trouve en base de donnees"))
                .build();
        }

        // 2. Build PlanningTimeslot list (creneau x jour_semaine)
        List<PlanningTimeslot> timeslots = new ArrayList<>();
        long timeslotIdSeq = 1;
        for (int jour = 1; jour <= 6; jour++) {
            for (Creneau c : courseCreneaux) {
                timeslots.add(new PlanningTimeslot(
                    timeslotIdSeq++, c.getId(), jour, c.getHeureDebut(), c.getHeureFin()
                ));
            }
        }

        // 3. Build PlanningRoom list from request
        List<PlanningRoom> rooms = new ArrayList<>();
        for (int i = 0; i < request.getRooms().size(); i++) {
            rooms.add(new PlanningRoom((long) (i + 1), request.getRooms().get(i)));
        }

        // 4. Load module coefficients
        Map<Long, Double> moduleCoefficients = new HashMap<>();
        for (TeachingAssignmentDTO a : request.getAssignments()) {
            if (!moduleCoefficients.containsKey(a.getModuleId())) {
                moduleRepository.findById(a.getModuleId())
                    .ifPresent(m -> moduleCoefficients.put(m.getId(), m.getCoeffEtatique()));
            }
        }

        // 5. Build PlanningLesson list from assignments
        List<PlanningLesson> lessons = new ArrayList<>();
        long lessonIdSeq = 1;
        for (TeachingAssignmentDTO assignment : request.getAssignments()) {
            Double coeff = moduleCoefficients.getOrDefault(assignment.getModuleId(), 1.0);
            for (int h = 0; h < assignment.getNbHeures(); h++) {
                lessons.add(new PlanningLesson(
                    lessonIdSeq++,
                    assignment.getClasseId(),
                    assignment.getModuleId(),
                    assignment.getEnseignantId(),
                    coeff
                ));
            }
        }

        // 6. Validate: enough timeslots?
        int totalSlots = timeslots.size() * rooms.size();
        if (lessons.size() > totalSlots) {
            return TimetableGenerationResponseDTO.builder()
                .status("INFEASIBLE")
                .score("N/A")
                .entries(Collections.emptyList())
                .unresolvedConflicts(List.of(
                    String.format("Pas assez de creneaux disponibles: %d cours a placer pour %d creneaux x %d salles = %d possibilites",
                        lessons.size(), timeslots.size(), rooms.size(), totalSlots)))
                .build();
        }

        // 7. Build and solve
        int timeout = request.getSolverTimeoutSeconds() != null ? request.getSolverTimeoutSeconds() : 30;
        TimetableSolution problem = new TimetableSolution(timeslots, rooms, lessons);

        SolverConfig solverConfig = new SolverConfig()
            .withSolutionClass(TimetableSolution.class)
            .withEntityClasses(PlanningLesson.class)
            .withConstraintProviderClass(TimetableConstraintProvider.class)
            .withTerminationConfig(new TerminationConfig()
                .withSpentLimit(Duration.ofSeconds(timeout)));

        SolverFactory<TimetableSolution> solverFactory = SolverFactory.create(solverConfig);
        Solver<TimetableSolution> solver = solverFactory.buildSolver();

        log.info("Starting timetable solving with {} lessons, {} timeslots, {} rooms, timeout={}s",
            lessons.size(), timeslots.size(), rooms.size(), timeout);

        TimetableSolution solution = solver.solve(problem);

        log.info("Timetable solving completed with score: {}", solution.getScore());

        // 8. Analyze results
        List<String> unresolvedConflicts = new ArrayList<>();
        if (solution.getScore().hardScore() < 0) {
            unresolvedConflicts.add(String.format(
                "Score dur negatif (%d): il reste des conflits non resolus",
                solution.getScore().hardScore()));
        }

        // 9. Collect distinct classeIds to delete old entries
        Set<Long> classeIds = request.getAssignments().stream()
            .map(TeachingAssignmentDTO::getClasseId)
            .collect(Collectors.toSet());

        // Delete existing timetable entries for affected classes
        for (Long classeId : classeIds) {
            emploiDuTempsRepository.deleteByClasseId(classeId);
        }

        // 10. Convert solution to EmploiDuTemps entities and persist
        List<EmploiDuTemps> entitiesToSave = new ArrayList<>();
        for (PlanningLesson lesson : solution.getLessons()) {
            if (lesson.getTimeslot() == null || lesson.getRoom() == null) {
                unresolvedConflicts.add(String.format(
                    "Cours non place: classeId=%d, moduleId=%d, enseignantId=%d",
                    lesson.getClasseId(), lesson.getModuleId(), lesson.getEnseignantId()));
                continue;
            }
            entitiesToSave.add(EmploiDuTemps.builder()
                .classeId(lesson.getClasseId())
                .creneauId(lesson.getTimeslot().getCreneauId())
                .jourSemaine(lesson.getTimeslot().getJourSemaine())
                .moduleId(lesson.getModuleId())
                .enseignantId(lesson.getEnseignantId())
                .salle(lesson.getRoom().getName())
                .build());
        }

        List<EmploiDuTemps> saved = emploiDuTempsRepository.saveAll(entitiesToSave);

        // 11. Build response
        List<EmploiDuTempsResponseDTO> responseDtos = saved.stream()
            .map(e -> EmploiDuTempsResponseDTO.builder()
                .id(e.getId())
                .classeId(e.getClasseId())
                .creneauId(e.getCreneauId())
                .jourSemaine(e.getJourSemaine())
                .moduleId(e.getModuleId())
                .enseignantId(e.getEnseignantId())
                .salle(e.getSalle())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build())
            .collect(Collectors.toList());

        String status = solution.getScore().hardScore() >= 0 ? "SOLVED" : "INFEASIBLE";
        return TimetableGenerationResponseDTO.builder()
            .status(status)
            .score(solution.getScore().toShortString())
            .entries(responseDtos)
            .unresolvedConflicts(unresolvedConflicts)
            .build();
    }
}
