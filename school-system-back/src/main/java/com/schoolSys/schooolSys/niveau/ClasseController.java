package com.schoolSys.schooolSys.niveau;

import com.schoolSys.schooolSys.common.dto.ApiResponse;
import com.schoolSys.schooolSys.niveau.dto.ClasseResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseRepository classeRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClasseResponseDTO>>> getAll(
            @RequestParam(required = false) Long niveauId) {
        List<Classe> classes = niveauId != null
                ? classeRepository.findByNiveauId(niveauId)
                : classeRepository.findAll();

        List<ClasseResponseDTO> dtos = classes.stream()
                .map(this::toResponse)
                .sorted(Comparator.comparing(ClasseResponseDTO::getFullName))
                .toList();

        return ResponseEntity.ok(ApiResponse.ok(dtos));
    }

    private ClasseResponseDTO toResponse(Classe c) {
        Niveau n = c.getNiveau();
        StringBuilder digits = new StringBuilder();
        for (char ch : n.getName().toCharArray()) {
            if (Character.isDigit(ch)) digits.append(ch);
            else break;
        }
        String fullName = digits.toString() + c.getLetter();

        return ClasseResponseDTO.builder()
                .id(c.getId())
                .letter(c.getLetter())
                .niveauId(n.getId())
                .niveauName(n.getName())
                .fullName(fullName)
                .build();
    }
}
