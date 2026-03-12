package com.schoolSys.schooolSys.absence;

import com.schoolSys.schooolSys.absence.dto.*;
import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.student.Student;
import com.schoolSys.schooolSys.student.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AbsenceService {

    private final AbsenceRepository absenceRepository;
    private final JustificatifRepository justificatifRepository;
    private final StudentRepository studentRepository;

    @Transactional
    public List<AbsenceResponseDTO> batchCreate(AbsenceBatchRequestDTO request) {
        List<Absence> absences = request.getAbsences().stream()
            .map(dto -> Absence.builder()
                .eleveId(dto.getEleveId())
                .date(dto.getDate())
                .type(dto.getType())
                .seance(dto.getSeance())
                .heureArrivee(dto.getHeureArrivee())
                .justifie(dto.getJustifie() != null ? dto.getJustifie() : false)
                .motif(dto.getMotif())
                .enseignantId(dto.getEnseignantId())
                .build())
            .collect(Collectors.toList());
        return absenceRepository.saveAll(absences).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public List<AbsenceResponseDTO> getByClasseAndDate(Long classeId, LocalDate date, String type) {
        List<Long> eleveIds = getEleveIdsByClasse(classeId);
        if (eleveIds.isEmpty()) return List.of();
        List<Absence> absences;
        if (type != null && !type.isBlank()) {
            absences = absenceRepository.findByDateAndEleveIdInAndType(date, eleveIds, type);
        } else {
            absences = absenceRepository.findByDateAndEleveIdIn(date, eleveIds);
        }
        return absences.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<AbsenceResponseDTO> getByEleve(Long eleveId) {
        return absenceRepository.findByEleveId(eleveId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public AbsenceStatsDTO getStats(Long classeId, int mois, int annee) {
        List<Long> eleveIds = getEleveIdsByClasse(classeId);
        if (eleveIds.isEmpty()) {
            return AbsenceStatsDTO.builder()
                .classeId(classeId).mois(mois).annee(annee)
                .totalAbsences(0).totalRetards(0)
                .totalJustifiees(0).totalNonJustifiees(0)
                .tauxAbsenteisme(0.0)
                .build();
        }
        List<Absence> absences = absenceRepository.findByEleveIdInAndMonthAndYear(eleveIds, mois, annee);
        long totalAbsences = absences.stream().filter(a -> "ABSENCE".equals(a.getType())).count();
        long totalRetards = absences.stream().filter(a -> "RETARD".equals(a.getType())).count();
        long totalJustifiees = absences.stream().filter(Absence::getJustifie).count();
        long totalNonJustifiees = absences.size() - totalJustifiees;
        double taux = eleveIds.size() > 0 ? (double) totalAbsences / eleveIds.size() * 100 : 0;

        return AbsenceStatsDTO.builder()
            .classeId(classeId).mois(mois).annee(annee)
            .totalAbsences(totalAbsences).totalRetards(totalRetards)
            .totalJustifiees(totalJustifiees).totalNonJustifiees(totalNonJustifiees)
            .tauxAbsenteisme(Math.round(taux * 100.0) / 100.0)
            .build();
    }

    @Transactional
    public AbsenceResponseDTO justifier(Long absenceId) {
        Absence absence = absenceRepository.findById(absenceId)
            .orElseThrow(() -> new ResourceNotFoundException("Absence", absenceId));
        absence.setJustifie(true);
        return toDto(absenceRepository.save(absence));
    }

    @Transactional
    public void delete(Long id) {
        if (!absenceRepository.existsById(id)) throw new ResourceNotFoundException("Absence", id);
        absenceRepository.deleteById(id);
    }

    private List<Long> getEleveIdsByClasse(Long classeId) {
        return studentRepository.findAll().stream()
            .filter(s -> s.getClasse() != null && s.getClasse().equals(String.valueOf(classeId)))
            .map(Student::getId)
            .collect(Collectors.toList());
    }

    private AbsenceResponseDTO toDto(Absence a) {
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
}
