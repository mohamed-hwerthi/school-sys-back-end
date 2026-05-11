package com.schoolSys.schooolSys.student;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.niveau.Niveau;
import com.schoolSys.schooolSys.niveau.NiveauRepository;
import com.schoolSys.schooolSys.student.dto.PassageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PassageService {

    private static final Pattern LEADING_DIGITS = Pattern.compile("(\\d+)");

    private final PassageRepository passageRepository;
    private final StudentRepository studentRepository;
    private final NiveauRepository niveauRepository;

    public List<PassageDTO> findByAnneeScolaire(String anneeScolaire) {
        return passageRepository.findByAnneeScolaire(anneeScolaire).stream()
                .map(this::toDTO)
                .toList();
    }

    public List<PassageDTO> findByStudentId(Long studentId) {
        return passageRepository.findByStudentIdOrderByCreatedAtDesc(studentId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public PassageDTO create(PassageDTO dto) {
        if (!studentRepository.existsById(dto.getStudentId())) {
            throw new ResourceNotFoundException("Student", dto.getStudentId());
        }

        validateDecision(dto);

        Passage passage = Passage.builder()
                .studentId(dto.getStudentId())
                .ancienNiveau(dto.getAncienNiveau())
                .nouveauNiveau(dto.getNouveauNiveau())
                .ancienneClasse(dto.getAncienneClasse())
                .nouvelleClasse(dto.getNouvelleClasse())
                .decision(dto.getDecision())
                .anneeScolaire(dto.getAnneeScolaire())
                .motif(dto.getMotif())
                .build();

        Passage saved = passageRepository.save(passage);

        // Update student's niveau and classe if PASSAGE
        if ("PASSAGE".equals(dto.getDecision()) && dto.getNouveauNiveau() != null) {
            studentRepository.findById(dto.getStudentId()).ifPresent(student -> {
                student.setNiveau(dto.getNouveauNiveau());
                if (dto.getNouvelleClasse() != null) {
                    student.setClasse(dto.getNouvelleClasse());
                }
                studentRepository.save(student);
            });
        }

        return toDTO(saved);
    }

    @Transactional
    public List<PassageDTO> bulkCreate(List<PassageDTO> dtos) {
        return dtos.stream()
                .map(this::create)
                .toList();
    }

    /**
     * Enforces business rules on the decision:
     * - PASSAGE: nouveauNiveau must be exactly the next niveau in the configured order
     *   (leading number + 1). Skipping a level is rejected.
     * - REDOUBLEMENT: nouveauNiveau, when provided, must equal ancienNiveau (the student
     *   stays in the same niveau; only the classe section may change).
     *
     * EXCLUSION and TRANSFERT are not constrained here — they intentionally bypass the
     * progression rules.
     */
    private void validateDecision(PassageDTO dto) {
        String decision = dto.getDecision() == null ? "" : dto.getDecision().toUpperCase();
        String ancien = dto.getAncienNiveau();
        String nouveau = dto.getNouveauNiveau();

        if ("PASSAGE".equals(decision)) {
            if (ancien == null || ancien.isBlank()) {
                throw new IllegalArgumentException("Passage impossible : le niveau actuel de l'élève est inconnu.");
            }
            if (nouveau == null || nouveau.isBlank()) {
                throw new IllegalArgumentException("Passage : le nouveau niveau est requis.");
            }
            String expected = nextNiveauName(ancien);
            if (expected == null) {
                throw new IllegalArgumentException(
                        "Passage impossible : aucun niveau supérieur n'est configuré après « " + ancien + " ».");
            }
            if (!expected.equalsIgnoreCase(nouveau.trim())) {
                throw new IllegalArgumentException(
                        "Passage invalide : un passage ne peut pas sauter de niveau. Depuis « "
                                + ancien + " » le seul passage autorisé est vers « " + expected + " ».");
            }
        } else if ("REDOUBLEMENT".equals(decision)) {
            if (ancien != null && nouveau != null && !nouveau.isBlank()
                    && !ancien.trim().equalsIgnoreCase(nouveau.trim())) {
                throw new IllegalArgumentException(
                        "Redoublement : le niveau doit rester « " + ancien + " ».");
            }
        }
    }

    /**
     * Returns the name of the niveau whose leading digit is exactly currentDigit + 1.
     * Returns null if the current niveau has no parseable digit, or if no niveau with
     * digit + 1 is configured.
     */
    private String nextNiveauName(String currentName) {
        Integer current = extractLeadingDigit(currentName);
        if (current == null) return null;
        int target = current + 1;
        return niveauRepository.findAll().stream()
                .filter(n -> {
                    Integer d = extractLeadingDigit(n.getName());
                    return d != null && d == target;
                })
                .map(Niveau::getName)
                .findFirst()
                .orElse(null);
    }

    private static Integer extractLeadingDigit(String name) {
        if (name == null) return null;
        Matcher m = LEADING_DIGITS.matcher(name);
        if (!m.find()) return null;
        try {
            return Integer.parseInt(m.group(1));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private PassageDTO toDTO(Passage passage) {
        String studentName = studentRepository.findById(passage.getStudentId())
                .map(s -> s.getFirstName() + " " + s.getLastName())
                .orElse("Inconnu");

        return PassageDTO.builder()
                .id(passage.getId())
                .studentId(passage.getStudentId())
                .studentName(studentName)
                .ancienNiveau(passage.getAncienNiveau())
                .nouveauNiveau(passage.getNouveauNiveau())
                .ancienneClasse(passage.getAncienneClasse())
                .nouvelleClasse(passage.getNouvelleClasse())
                .decision(passage.getDecision())
                .anneeScolaire(passage.getAnneeScolaire())
                .motif(passage.getMotif())
                .createdAt(passage.getCreatedAt() != null ? passage.getCreatedAt().toString() : null)
                .build();
    }
}
