package com.schoolSys.schooolSys.examen;

import com.schoolSys.schooolSys.auth.UserRole;
import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.common.security.CurrentUserContext;
import com.schoolSys.schooolSys.examen.dto.ExamenRequestDTO;
import com.schoolSys.schooolSys.examen.dto.ExamenResponseDTO;
import com.schoolSys.schooolSys.module.Module;
import com.schoolSys.schooolSys.module.ModuleRepository;
import com.schoolSys.schooolSys.niveau.Classe;
import com.schoolSys.schooolSys.niveau.ClasseRepository;
import com.schoolSys.schooolSys.note.NoteRepository;
import com.schoolSys.schooolSys.student.StudentRepository;
import com.schoolSys.schooolSys.teacher.Teacher;
import com.schoolSys.schooolSys.teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExamenService {

    private final ExamenRepository examenRepository;
    private final ModuleRepository moduleRepository;
    private final ClasseRepository classeRepository;
    private final TeacherRepository teacherRepository;
    private final NoteRepository noteRepository;
    private final StudentRepository studentRepository;
    private final CurrentUserContext currentUser;

    public List<ExamenResponseDTO> findAll(Long moduleId, Long classeId, Integer trimestre) {
        List<Examen> list = examenRepository.findFiltered(moduleId, classeId, trimestre);
        // Row-level scoping: an ENSEIGNANT only sees exams in his own classes and subjects.
        if (currentUser.hasRole(UserRole.ENSEIGNANT)) {
            Set<Long> scopedClasses = currentUser.getScopedClasseIdsForTeacher();
            Set<Long> scopedModules = currentUser.getScopedModuleIdsForTeacher();
            list = list.stream()
                    .filter(e -> e.getClasse() != null && scopedClasses.contains(e.getClasse().getId()))
                    .filter(e -> e.getModule() != null && scopedModules.contains(e.getModule().getId()))
                    .toList();
        }
        return list.stream()
                .map(this::toResponse)
                .toList();
    }

    public ExamenResponseDTO findById(Long id) {
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Examen", id));
        return toResponse(examen);
    }

    @Transactional
    public ExamenResponseDTO create(ExamenRequestDTO dto) {
        Module module = moduleRepository.findById(dto.getModuleId())
                .orElseThrow(() -> new ResourceNotFoundException("Module", dto.getModuleId()));
        Classe classe = classeRepository.findById(dto.getClasseId())
                .orElseThrow(() -> new ResourceNotFoundException("Classe", dto.getClasseId()));

        Teacher teacher = null;
        if (dto.getTeacherId() != null) {
            teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", dto.getTeacherId()));
        }

        Examen examen = Examen.builder()
                .name(dto.getName())
                .namePrive(dto.getNamePrive())
                .coeffEtatique(dto.getCoeffEtatique())
                .coeffPrive(dto.getCoeffPrive())
                .ordreEtatique(dto.getOrdreEtatique())
                .ordrePrive(dto.getOrdrePrive())
                .trimestre(dto.getTrimestre())
                .classe(classe)
                .teacher(teacher)
                .module(module)
                .versionEtatique(dto.getVersionEtatique())
                .versionPrivee(dto.getVersionPrivee())
                .build();

        return toResponse(examenRepository.save(examen));
    }

    @Transactional
    public ExamenResponseDTO update(Long id, ExamenRequestDTO dto) {
        Examen examen = examenRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Examen", id));

        Module module = moduleRepository.findById(dto.getModuleId())
                .orElseThrow(() -> new ResourceNotFoundException("Module", dto.getModuleId()));
        Classe classe = classeRepository.findById(dto.getClasseId())
                .orElseThrow(() -> new ResourceNotFoundException("Classe", dto.getClasseId()));

        Teacher teacher = null;
        if (dto.getTeacherId() != null) {
            teacher = teacherRepository.findById(dto.getTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Teacher", dto.getTeacherId()));
        }

        examen.setName(dto.getName());
        examen.setNamePrive(dto.getNamePrive());
        examen.setCoeffEtatique(dto.getCoeffEtatique());
        examen.setCoeffPrive(dto.getCoeffPrive());
        examen.setOrdreEtatique(dto.getOrdreEtatique());
        examen.setOrdrePrive(dto.getOrdrePrive());
        examen.setTrimestre(dto.getTrimestre());
        examen.setClasse(classe);
        examen.setTeacher(teacher);
        examen.setModule(module);
        examen.setVersionEtatique(dto.getVersionEtatique());
        examen.setVersionPrivee(dto.getVersionPrivee());

        return toResponse(examenRepository.save(examen));
    }

    @Transactional
    public void delete(Long id) {
        if (!examenRepository.existsById(id)) {
            throw new ResourceNotFoundException("Examen", id);
        }
        examenRepository.deleteById(id);
    }

    @Transactional
    public void deleteBulk(List<Long> ids) {
        examenRepository.deleteAllByIdInBatch(ids);
    }

    private ExamenResponseDTO toResponse(Examen examen) {
        String classeName = "";
        if (examen.getClasse() != null && examen.getClasse().getNiveau() != null) {
            String prefix = examen.getClasse().getNiveau().getName().replaceAll("[^0-9]", "");
            classeName = prefix + "ème " + examen.getClasse().getLetter();
        }

        String teacherName = "";
        if (examen.getTeacher() != null) {
            teacherName = examen.getTeacher().getFirstName() + " " + examen.getTeacher().getLastName();
        }

        long nbNotes = noteRepository.countByExamenIdAndTrimestre(examen.getId(), examen.getTrimestre());
        long nbEleves = classeName.isEmpty() ? 0 : studentRepository.countByClasse(classeName);

        return ExamenResponseDTO.builder()
                .id(examen.getId())
                .name(examen.getName())
                .namePrive(examen.getNamePrive())
                .coeffEtatique(examen.getCoeffEtatique())
                .coeffPrive(examen.getCoeffPrive())
                .ordreEtatique(examen.getOrdreEtatique())
                .ordrePrive(examen.getOrdrePrive())
                .trimestre(examen.getTrimestre())
                .classeId(examen.getClasse().getId())
                .classeName(classeName)
                .teacherId(examen.getTeacher() != null ? examen.getTeacher().getId() : null)
                .teacherName(teacherName)
                .moduleId(examen.getModule().getId())
                .moduleName(examen.getModule().getName())
                .versionEtatique(examen.getVersionEtatique())
                .versionPrivee(examen.getVersionPrivee())
                .nbNotes(nbNotes)
                .nbEleves(nbEleves)
                .build();
    }
}
