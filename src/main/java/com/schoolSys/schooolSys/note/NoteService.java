package com.schoolSys.schooolSys.note;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.examen.Examen;
import com.schoolSys.schooolSys.examen.ExamenRepository;
import com.schoolSys.schooolSys.note.dto.MoyenneDTO;
import com.schoolSys.schooolSys.note.dto.NoteRequestDTO;
import com.schoolSys.schooolSys.note.dto.NoteResponseDTO;
import com.schoolSys.schooolSys.student.Student;
import com.schoolSys.schooolSys.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NoteService {

    private final NoteRepository noteRepository;
    private final ExamenRepository examenRepository;
    private final StudentRepository studentRepository;

    public List<NoteResponseDTO> findByExamen(Long examenId, Integer trimestre) {
        return noteRepository.findByExamenIdAndTrimestre(examenId, trimestre).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<NoteResponseDTO> findByStudent(Long studentId, Integer trimestre) {
        return noteRepository.findByStudentIdAndTrimestre(studentId, trimestre).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public List<NoteResponseDTO> upsertBulk(List<NoteRequestDTO> dtos) {
        List<Note> saved = new ArrayList<>();

        for (NoteRequestDTO dto : dtos) {
            Optional<Note> existing = noteRepository.findByStudentIdAndExamenIdAndTrimestre(
                    dto.getStudentId(), dto.getExamenId(), dto.getTrimestre());

            if (existing.isPresent()) {
                Note note = existing.get();
                note.setValeur(dto.getValeur());
                note.setObservation(dto.getObservation());
                note.setUpdatedAt(LocalDateTime.now());
                saved.add(noteRepository.save(note));
            } else {
                Student student = studentRepository.findById(dto.getStudentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Student", dto.getStudentId()));
                Examen examen = examenRepository.findById(dto.getExamenId())
                        .orElseThrow(() -> new ResourceNotFoundException("Examen", dto.getExamenId()));

                Note note = Note.builder()
                        .student(student)
                        .examen(examen)
                        .trimestre(dto.getTrimestre())
                        .valeur(dto.getValeur())
                        .observation(dto.getObservation())
                        .build();
                saved.add(noteRepository.save(note));
            }
        }

        return saved.stream().map(this::toResponse).toList();
    }

    public List<MoyenneDTO> getMoyennes(Long classeId, Integer trimestre) {
        List<Note> notes = noteRepository.findByExamenClasseIdAndTrimestre(classeId, trimestre);

        // Group by student
        Map<Long, List<Note>> byStudent = notes.stream()
                .collect(Collectors.groupingBy(n -> n.getStudent().getId()));

        List<MoyenneDTO> result = new ArrayList<>();

        for (Map.Entry<Long, List<Note>> entry : byStudent.entrySet()) {
            List<Note> studentNotes = entry.getValue();
            Student student = studentNotes.get(0).getStudent();

            // Group by module
            Map<String, List<Note>> byModule = studentNotes.stream()
                    .collect(Collectors.groupingBy(n -> n.getExamen().getModule().getName()));

            Map<String, Double> moyennesParModule = new LinkedHashMap<>();
            double totalWeighted = 0;
            double totalCoeff = 0;

            for (Map.Entry<String, List<Note>> moduleEntry : byModule.entrySet()) {
                List<Note> moduleNotes = moduleEntry.getValue();
                double sumWeighted = 0;
                double sumCoeff = 0;

                for (Note n : moduleNotes) {
                    if (n.getValeur() != null) {
                        double coeff = n.getExamen().getCoeffEtatique();
                        sumWeighted += n.getValeur() * coeff;
                        sumCoeff += coeff;
                    }
                }

                double moyenne = sumCoeff > 0 ? Math.round(sumWeighted / sumCoeff * 100.0) / 100.0 : 0;
                moyennesParModule.put(moduleEntry.getKey(), moyenne);

                double moduleCoeff = moduleNotes.get(0).getExamen().getModule().getCoeffEtatique();
                totalWeighted += moyenne * moduleCoeff;
                totalCoeff += moduleCoeff;
            }

            double moyenneGenerale = totalCoeff > 0 ? Math.round(totalWeighted / totalCoeff * 100.0) / 100.0 : 0;

            result.add(MoyenneDTO.builder()
                    .studentId(student.getId())
                    .studentName(student.getFirstName() + " " + student.getLastName())
                    .trimestre(trimestre)
                    .moyennesParModule(moyennesParModule)
                    .moyenneGenerale(moyenneGenerale)
                    .build());
        }

        result.sort(Comparator.comparing(MoyenneDTO::getStudentName));
        return result;
    }

    @Transactional
    public void delete(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Note", id);
        }
        noteRepository.deleteById(id);
    }

    private NoteResponseDTO toResponse(Note note) {
        return NoteResponseDTO.builder()
                .id(note.getId())
                .studentId(note.getStudent().getId())
                .studentName(note.getStudent().getFirstName() + " " + note.getStudent().getLastName())
                .examenId(note.getExamen().getId())
                .examenName(note.getExamen().getName())
                .trimestre(note.getTrimestre())
                .valeur(note.getValeur())
                .observation(note.getObservation())
                .build();
    }
}
