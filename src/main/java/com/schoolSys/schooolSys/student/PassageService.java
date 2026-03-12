package com.schoolSys.schooolSys.student;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.student.dto.PassageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PassageService {

    private final PassageRepository passageRepository;
    private final StudentRepository studentRepository;

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
