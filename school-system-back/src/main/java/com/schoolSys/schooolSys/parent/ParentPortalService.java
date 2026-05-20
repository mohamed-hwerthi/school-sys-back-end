package com.schoolSys.schooolSys.parent;

import java.util.UUID;

import com.schoolSys.schooolSys.absence.Absence;
import com.schoolSys.schooolSys.absence.AbsenceRepository;
import com.schoolSys.schooolSys.absence.dto.AbsenceResponseDTO;
import com.schoolSys.schooolSys.bulletin.BulletinService;
import com.schoolSys.schooolSys.bulletin.dto.BulletinDTO;
import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.emploidutemps.EmploiDuTemps;
import com.schoolSys.schooolSys.emploidutemps.EmploiDuTempsRepository;
import com.schoolSys.schooolSys.emploidutemps.dto.EmploiDuTempsResponseDTO;
import com.schoolSys.schooolSys.note.Note;
import com.schoolSys.schooolSys.note.NoteRepository;
import com.schoolSys.schooolSys.note.dto.NoteResponseDTO;
import com.schoolSys.schooolSys.parent.dto.ChildDTO;
import com.schoolSys.schooolSys.student.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParentPortalService {

    private final ParentStudentRepository parentStudentRepository;
    private final NoteRepository noteRepository;
    private final AbsenceRepository absenceRepository;
    private final BulletinService bulletinService;
    private final EmploiDuTempsRepository emploiDuTempsRepository;

    public List<ChildDTO> getChildren(UUID parentUserId) {
        return parentStudentRepository.findByParentUserId(parentUserId)
                .stream()
                .map(ps -> {
                    Student s = ps.getStudent();
                    return ChildDTO.builder()
                            .id(s.getId())
                            .firstName(s.getFirstName())
                            .lastName(s.getLastName())
                            .classe(s.getClasse())
                            .niveau(s.getNiveau())
                            .matricule(s.getMatricule())
                            .build();
                })
                .collect(Collectors.toList());
    }

    public List<NoteResponseDTO> getChildNotes(UUID parentUserId, UUID studentId, Integer trimestre) {
        verifyParentLink(parentUserId, studentId);
        List<Note> notes = noteRepository.findByStudentIdAndTrimestre(studentId, trimestre);
        return notes.stream()
                .map(n -> NoteResponseDTO.builder()
                        .id(n.getId())
                        .studentId(n.getStudent().getId())
                        .studentName(n.getStudent().getFirstName() + " " + n.getStudent().getLastName())
                        .examenId(n.getExamen().getId())
                        .examenName(n.getExamen().getName())
                        .trimestre(n.getTrimestre())
                        .valeur(n.getValeur())
                        .observation(n.getObservation())
                        .build())
                .collect(Collectors.toList());
    }

    public List<AbsenceResponseDTO> getChildAbsences(UUID parentUserId, UUID studentId) {
        verifyParentLink(parentUserId, studentId);
        return absenceRepository.findByEleveId(studentId)
                .stream()
                .map(this::toAbsenceDto)
                .collect(Collectors.toList());
    }

    public BulletinDTO getChildBulletin(UUID parentUserId, UUID studentId, UUID classeId, Integer trimestre) {
        verifyParentLink(parentUserId, studentId);
        return bulletinService.getBulletin(classeId, studentId, trimestre, "etatique");
    }

    public List<EmploiDuTempsResponseDTO> getChildEmploiDuTemps(UUID parentUserId, UUID studentId) {
        verifyParentLink(parentUserId, studentId);

        // Get student's classe to find their schedule
        ParentStudent ps = parentStudentRepository.findByParentUserId(parentUserId)
                .stream()
                .filter(p -> p.getStudent().getId().equals(studentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Parent-Student link not found"));

        String classeStr = ps.getStudent().getClasse();
        if (classeStr == null) return List.of();

        try {
            UUID classeId = UUID.fromString(classeStr);
            return emploiDuTempsRepository.findByClasseId(classeId)
                    .stream()
                    .map(this::toEmploiDto)
                    .collect(Collectors.toList());
        } catch (NumberFormatException e) {
            return List.of();
        }
    }

    private void verifyParentLink(UUID parentUserId, UUID studentId) {
        boolean linked = parentStudentRepository.findByParentUserId(parentUserId)
                .stream()
                .anyMatch(ps -> ps.getStudent().getId().equals(studentId));
        if (!linked) {
            throw new ResourceNotFoundException("Student not linked to this parent account");
        }
    }

    private AbsenceResponseDTO toAbsenceDto(Absence a) {
        return AbsenceResponseDTO.builder()
                .id(a.getId())
                .eleveId(a.getEleveId())
                .date(a.getDate())
                .type(a.getType())
                .seance(a.getSeance())
                .heureArrivee(a.getHeureArrivee())
                .justifie(a.getJustifie())
                .motif(a.getMotif())
                .enseignantId(a.getEnseignantId())
                .createdAt(a.getCreatedAt())
                .updatedAt(a.getUpdatedAt())
                .build();
    }

    private EmploiDuTempsResponseDTO toEmploiDto(EmploiDuTemps e) {
        return EmploiDuTempsResponseDTO.builder()
                .id(e.getId())
                .classeId(e.getClasseId())
                .creneauId(e.getCreneauId())
                .jourSemaine(e.getJourSemaine())
                .moduleId(e.getModuleId())
                .enseignantId(e.getEnseignantId())
                .salle(e.getSalle())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}
