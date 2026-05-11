package com.schoolSys.schooolSys.affectation;

import com.schoolSys.schooolSys.affectation.dto.AffectationDTO;
import com.schoolSys.schooolSys.affectation.dto.AffectationRequestDTO;
import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.module.ModuleRepository;
import com.schoolSys.schooolSys.niveau.Classe;
import com.schoolSys.schooolSys.niveau.ClasseRepository;
import com.schoolSys.schooolSys.teacher.Teacher;
import com.schoolSys.schooolSys.teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AffectationService {

    private final AffectationRepository affectationRepository;
    private final TeacherRepository teacherRepository;
    private final ClasseRepository classeRepository;
    private final ModuleRepository moduleRepository;

    public List<AffectationDTO> search(Long teacherId, Long classeId, Long moduleId, String anneeScolaire) {
        List<Affectation> rows = affectationRepository.search(teacherId, classeId, moduleId, anneeScolaire);
        return hydrate(rows);
    }

    public AffectationDTO findById(Long id) {
        Affectation a = affectationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation", id));
        return hydrate(List.of(a)).get(0);
    }

    @Transactional
    public AffectationDTO create(AffectationRequestDTO req) {
        validate(req, null);
        Affectation a = Affectation.builder()
                .teacherId(req.getTeacherId())
                .classeId(req.getClasseId())
                .moduleId(req.getModuleId())
                .anneeScolaire(req.getAnneeScolaire())
                .dateDebut(req.getDateDebut())
                .dateFin(req.getDateFin())
                .notes(req.getNotes())
                .build();
        Affectation saved = affectationRepository.save(a);
        return hydrate(List.of(saved)).get(0);
    }

    @Transactional
    public AffectationDTO update(Long id, AffectationRequestDTO req) {
        Affectation existing = affectationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Affectation", id));
        validate(req, id);
        existing.setTeacherId(req.getTeacherId());
        existing.setClasseId(req.getClasseId());
        existing.setModuleId(req.getModuleId());
        existing.setAnneeScolaire(req.getAnneeScolaire());
        existing.setDateDebut(req.getDateDebut());
        existing.setDateFin(req.getDateFin());
        existing.setNotes(req.getNotes());
        Affectation saved = affectationRepository.save(existing);
        return hydrate(List.of(saved)).get(0);
    }

    @Transactional
    public void delete(Long id) {
        if (!affectationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Affectation", id);
        }
        affectationRepository.deleteById(id);
    }

    /**
     * Validates referenced entities exist, dates are coherent, and the (teacher, classe,
     * module, annee) tuple is unique.
     */
    private void validate(AffectationRequestDTO req, Long excludeId) {
        if (!teacherRepository.existsById(req.getTeacherId())) {
            throw new ResourceNotFoundException("Teacher", req.getTeacherId());
        }
        if (!classeRepository.existsById(req.getClasseId())) {
            throw new ResourceNotFoundException("Classe", req.getClasseId());
        }
        if (req.getModuleId() != null && !moduleRepository.existsById(req.getModuleId())) {
            throw new ResourceNotFoundException("Module", req.getModuleId());
        }
        if (req.getAnneeScolaire() == null || req.getAnneeScolaire().isBlank()) {
            throw new IllegalArgumentException("L'année scolaire est requise.");
        }
        if (req.getDateDebut() != null && req.getDateFin() != null
                && req.getDateFin().isBefore(req.getDateDebut())) {
            throw new IllegalArgumentException("La date de fin doit être postérieure à la date de début.");
        }
        long dup = affectationRepository.countDuplicate(
                req.getTeacherId(),
                req.getClasseId(),
                req.getModuleId(),
                req.getAnneeScolaire(),
                excludeId
        );
        if (dup > 0) {
            throw new IllegalArgumentException(
                    "Cette affectation existe déjà (même enseignant, classe, matière et année).");
        }
    }

    /**
     * Batch-loads the referenced teachers, classes and modules to populate the DTOs.
     * Cheaper than N+1 lookups in the toDTO helper.
     */
    private List<AffectationDTO> hydrate(List<Affectation> rows) {
        if (rows.isEmpty()) return List.of();

        Map<Long, String> teacherNames = new HashMap<>();
        teacherRepository.findAllById(rows.stream().map(Affectation::getTeacherId).distinct().toList())
                .forEach(t -> teacherNames.put(t.getId(), buildTeacherName(t)));

        Map<Long, String> classeNames = new HashMap<>();
        classeRepository.findAllById(rows.stream().map(Affectation::getClasseId).distinct().toList())
                .forEach(c -> classeNames.put(c.getId(), buildClasseName(c)));

        Map<Long, String> moduleNames = new HashMap<>();
        moduleRepository.findAllById(
                rows.stream().map(Affectation::getModuleId).filter(java.util.Objects::nonNull).distinct().toList()
        ).forEach(m -> moduleNames.put(m.getId(), m.getName()));

        return rows.stream().map(a -> AffectationDTO.builder()
                .id(a.getId())
                .teacherId(a.getTeacherId())
                .teacherName(teacherNames.getOrDefault(a.getTeacherId(), "Inconnu"))
                .classeId(a.getClasseId())
                .classeName(classeNames.getOrDefault(a.getClasseId(), "Inconnue"))
                .moduleId(a.getModuleId())
                .moduleName(a.getModuleId() == null ? null : moduleNames.get(a.getModuleId()))
                .anneeScolaire(a.getAnneeScolaire())
                .dateDebut(a.getDateDebut())
                .dateFin(a.getDateFin())
                .notes(a.getNotes())
                .build()
        ).toList();
    }

    private static String buildTeacherName(Teacher t) {
        String first = t.getFirstName() == null ? "" : t.getFirstName();
        String last = t.getLastName() == null ? "" : t.getLastName();
        return (first + " " + last).trim();
    }

    /** "1A" style: leading digits of niveau name + letter. Falls back to "{niveauName} {letter}". */
    private static String buildClasseName(Classe c) {
        if (c.getNiveau() == null) return c.getLetter();
        String niveauName = c.getNiveau().getName();
        StringBuilder digits = new StringBuilder();
        for (char ch : niveauName.toCharArray()) {
            if (Character.isDigit(ch)) digits.append(ch);
            else break;
        }
        if (digits.length() == 0) return niveauName + " " + c.getLetter();
        return digits.toString() + c.getLetter();
    }
}
