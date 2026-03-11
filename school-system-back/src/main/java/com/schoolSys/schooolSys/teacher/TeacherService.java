package com.schoolSys.schooolSys.teacher;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.teacher.dto.TeacherRequestDTO;
import com.schoolSys.schooolSys.teacher.dto.TeacherResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TeacherService {

    private final TeacherRepository teacherRepository;
    private final TeacherMapper teacherMapper;

    public List<TeacherResponseDTO> findAll() {
        return teacherRepository.findAll().stream()
                .map(teacherMapper::toResponseDTO)
                .toList();
    }

    public TeacherResponseDTO findById(Long id) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));
        return teacherMapper.toResponseDTO(teacher);
    }

    @Transactional
    public TeacherResponseDTO create(TeacherRequestDTO dto) {
        Teacher teacher = teacherMapper.toEntity(dto);
        return teacherMapper.toResponseDTO(teacherRepository.save(teacher));
    }

    @Transactional
    public TeacherResponseDTO update(Long id, TeacherRequestDTO dto) {
        Teacher teacher = teacherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher", id));
        teacherMapper.updateEntity(dto, teacher);
        return teacherMapper.toResponseDTO(teacherRepository.save(teacher));
    }

    @Transactional
    public void delete(Long id) {
        if (!teacherRepository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher", id);
        }
        teacherRepository.deleteById(id);
    }

    @Transactional
    public List<TeacherResponseDTO> importBulk(List<TeacherRequestDTO> dtos) {
        List<Teacher> teachers = dtos.stream()
                .map(teacherMapper::toEntity)
                .toList();
        return teacherRepository.saveAll(teachers).stream()
                .map(teacherMapper::toResponseDTO)
                .toList();
    }
}
