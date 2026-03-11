package com.schoolSys.schooolSys.student;

import com.schoolSys.schooolSys.common.dto.PagedResponse;
import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.student.dto.StudentRequestDTO;
import com.schoolSys.schooolSys.student.dto.StudentResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentMapper studentMapper;

    public List<StudentResponseDTO> findAll() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toResponseDTO)
                .toList();
    }

    public PagedResponse<StudentResponseDTO> findAll(
            String search,
            String niveau,
            String classe,
            String status,
            String sex,
            Boolean blocked,
            Pageable pageable
    ) {
        Specification<Student> spec = Specification
                .where(StudentSpecification.search(search))
                .and(StudentSpecification.hasNiveau(niveau))
                .and(StudentSpecification.hasClasse(classe))
                .and(StudentSpecification.hasStatus(status))
                .and(StudentSpecification.hasSex(sex))
                .and(StudentSpecification.isBlocked(blocked));

        Page<Student> page = studentRepository.findAll(spec, pageable);
        List<StudentResponseDTO> content = page.getContent().stream()
                .map(studentMapper::toResponseDTO)
                .toList();

        return PagedResponse.from(page, content);
    }

    public StudentResponseDTO findById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
        return studentMapper.toResponseDTO(student);
    }

    @Transactional
    public StudentResponseDTO create(StudentRequestDTO dto) {
        Student student = studentMapper.toEntity(dto);
        return studentMapper.toResponseDTO(studentRepository.save(student));
    }

    @Transactional
    public StudentResponseDTO update(Long id, StudentRequestDTO dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student", id));
        studentMapper.updateEntity(dto, student);
        return studentMapper.toResponseDTO(studentRepository.save(student));
    }

    @Transactional
    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student", id);
        }
        studentRepository.deleteById(id);
    }

    @Transactional
    public List<StudentResponseDTO> importBulk(List<StudentRequestDTO> dtos) {
        List<Student> students = dtos.stream()
                .map(studentMapper::toEntity)
                .toList();
        return studentRepository.saveAll(students).stream()
                .map(studentMapper::toResponseDTO)
                .toList();
    }
}
