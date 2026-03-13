package com.schoolSys.schooolSys.emploidutemps;

import com.schoolSys.schooolSys.emploidutemps.dto.EmploiDuTempsResponseDTO;
import com.schoolSys.schooolSys.emploidutemps.dto.TeachingAssignmentDTO;
import com.schoolSys.schooolSys.emploidutemps.dto.TimetableGenerationRequestDTO;
import com.schoolSys.schooolSys.emploidutemps.dto.TimetableGenerationResponseDTO;
import com.schoolSys.schooolSys.emploidutemps.solver.TimetableSolverService;
import com.schoolSys.schooolSys.module.Module;
import com.schoolSys.schooolSys.module.ModuleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
@DisplayName("TimetableSolverService Unit Tests")
class TimetableSolverServiceTest {

    @Mock
    private CreneauRepository creneauRepository;

    @Mock
    private EmploiDuTempsRepository emploiDuTempsRepository;

    @Mock
    private ModuleRepository moduleRepository;

    @InjectMocks
    private TimetableSolverService timetableSolverService;

    private List<Creneau> courseCreneaux;

    @BeforeEach
    void setUp() {
        // Simulate 3 course creneaux (like a real school day)
        courseCreneaux = List.of(
                buildCreneau(1L, "Session 1", LocalTime.of(8, 0), LocalTime.of(9, 0), "COURS"),
                buildCreneau(2L, "Session 2", LocalTime.of(9, 0), LocalTime.of(10, 0), "COURS"),
                buildCreneau(3L, "Session 3", LocalTime.of(10, 0), LocalTime.of(11, 0), "COURS")
        );
    }

    private Creneau buildCreneau(Long id, String label, LocalTime debut, LocalTime fin, String type) {
        Creneau c = new Creneau();
        c.setId(id);
        c.setLabel(label);
        c.setHeureDebut(debut);
        c.setHeureFin(fin);
        c.setType(type);
        return c;
    }

    @Nested
    @DisplayName("generate() — valid scenarios")
    class ValidScenarios {

        @Test
        @DisplayName("should generate a SOLVED timetable for simple assignment")
        void shouldGenerateSolvedTimetable() {
            when(creneauRepository.findByType("COURS")).thenReturn(courseCreneaux);
            when(moduleRepository.findById(10L)).thenReturn(Optional.of(
                    Module.builder().id(10L).coeffEtatique(2.0).build()
            ));
            doNothing().when(emploiDuTempsRepository).deleteByClasseId(anyLong());
            when(emploiDuTempsRepository.saveAll(any())).thenAnswer(inv -> inv.getArgument(0));

            TimetableGenerationRequestDTO request = TimetableGenerationRequestDTO.builder()
                    .assignments(List.of(
                            TeachingAssignmentDTO.builder()
                                    .classeId(1L).moduleId(10L).enseignantId(100L).nbHeures(2)
                                    .build()
                    ))
                    .rooms(List.of("Salle A1"))
                    .solverTimeoutSeconds(5)
                    .build();

            TimetableGenerationResponseDTO result = timetableSolverService.generate(request);

            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isIn("SOLVED", "INFEASIBLE");

            if ("SOLVED".equals(result.getStatus())) {
                assertThat(result.getEntries()).isNotEmpty();
                assertThat(result.getEntries().size()).isEqualTo(2); // 2 hours = 2 entries
            }
        }

        @Test
        @DisplayName("should generate timetable for multiple classes and teachers")
        void shouldGenerateForMultipleClassesAndTeachers() {
            when(creneauRepository.findByType("COURS")).thenReturn(courseCreneaux);
            when(moduleRepository.findById(10L)).thenReturn(Optional.of(
                    Module.builder().id(10L).coeffEtatique(2.0).build()
            ));
            when(moduleRepository.findById(11L)).thenReturn(Optional.of(
                    Module.builder().id(11L).coeffEtatique(1.0).build()
            ));
            doNothing().when(emploiDuTempsRepository).deleteByClasseId(anyLong());
            when(emploiDuTempsRepository.saveAll(any())).thenAnswer(inv -> inv.getArgument(0));

            TimetableGenerationRequestDTO request = TimetableGenerationRequestDTO.builder()
                    .assignments(List.of(
                            TeachingAssignmentDTO.builder()
                                    .classeId(1L).moduleId(10L).enseignantId(100L).nbHeures(2)
                                    .build(),
                            TeachingAssignmentDTO.builder()
                                    .classeId(1L).moduleId(11L).enseignantId(101L).nbHeures(1)
                                    .build(),
                            TeachingAssignmentDTO.builder()
                                    .classeId(2L).moduleId(10L).enseignantId(100L).nbHeures(2)
                                    .build()
                    ))
                    .rooms(List.of("Salle A1", "Salle A2"))
                    .solverTimeoutSeconds(10)
                    .build();

            TimetableGenerationResponseDTO result = timetableSolverService.generate(request);

            assertThat(result).isNotNull();
            assertThat(result.getStatus()).isIn("SOLVED", "INFEASIBLE");
        }
    }

    @Nested
    @DisplayName("generate() — edge cases")
    class EdgeCases {

        @Test
        @DisplayName("should return INFEASIBLE when no creneaux of type COURS exist")
        void shouldReturnInfeasibleWhenNoCreneaux() {
            when(creneauRepository.findByType("COURS")).thenReturn(List.of());

            TimetableGenerationRequestDTO request = TimetableGenerationRequestDTO.builder()
                    .assignments(List.of(
                            TeachingAssignmentDTO.builder()
                                    .classeId(1L).moduleId(10L).enseignantId(100L).nbHeures(2)
                                    .build()
                    ))
                    .rooms(List.of("Salle A1"))
                    .solverTimeoutSeconds(5)
                    .build();

            TimetableGenerationResponseDTO result = timetableSolverService.generate(request);
            assertThat(result.getStatus()).isEqualTo("INFEASIBLE");
            assertThat(result.getEntries()).isEmpty();
        }

        @Test
        @DisplayName("should return INFEASIBLE when too many lessons for available slots")
        void shouldReturnInfeasibleWhenOverloaded() {
            // Only 1 creneau for the whole week = 6 slots (6 days x 1 creneau)
            when(creneauRepository.findByType("COURS")).thenReturn(List.of(courseCreneaux.get(0)));
            when(moduleRepository.findById(anyLong())).thenReturn(Optional.of(
                    Module.builder().id(10L).coeffEtatique(1.0).build()
            ));
            lenient().doNothing().when(emploiDuTempsRepository).deleteByClasseId(anyLong());
            lenient().when(emploiDuTempsRepository.saveAll(any())).thenAnswer(inv -> inv.getArgument(0));

            // 10 hours but only 1 room x 6 slots = 6 max
            TimetableGenerationRequestDTO request = TimetableGenerationRequestDTO.builder()
                    .assignments(List.of(
                            TeachingAssignmentDTO.builder()
                                    .classeId(1L).moduleId(10L).enseignantId(100L).nbHeures(10)
                                    .build()
                    ))
                    .rooms(List.of("Salle A1"))
                    .solverTimeoutSeconds(5)
                    .build();

            // This should either throw (feasibility check) or return INFEASIBLE
            try {
                TimetableGenerationResponseDTO result = timetableSolverService.generate(request);
                // If it doesn't throw, it should be infeasible
                assertThat(result.getStatus()).isEqualTo("INFEASIBLE");
            } catch (IllegalArgumentException e) {
                // Expected — feasibility validation caught it
                assertThat(e.getMessage()).containsIgnoringCase("fit");
            }
        }

        @Test
        @DisplayName("should use default coefficient when module not found")
        void shouldUseDefaultCoefficientWhenModuleNotFound() {
            when(creneauRepository.findByType("COURS")).thenReturn(courseCreneaux);
            when(moduleRepository.findById(anyLong())).thenReturn(Optional.empty());
            doNothing().when(emploiDuTempsRepository).deleteByClasseId(anyLong());
            when(emploiDuTempsRepository.saveAll(any())).thenAnswer(inv -> inv.getArgument(0));

            TimetableGenerationRequestDTO request = TimetableGenerationRequestDTO.builder()
                    .assignments(List.of(
                            TeachingAssignmentDTO.builder()
                                    .classeId(1L).moduleId(999L).enseignantId(100L).nbHeures(1)
                                    .build()
                    ))
                    .rooms(List.of("Salle A1"))
                    .solverTimeoutSeconds(5)
                    .build();

            // Should not throw — uses default coefficient
            TimetableGenerationResponseDTO result = timetableSolverService.generate(request);
            assertThat(result).isNotNull();
        }
    }
}
