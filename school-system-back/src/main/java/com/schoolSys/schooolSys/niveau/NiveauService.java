package com.schoolSys.schooolSys.niveau;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.niveau.dto.NiveauResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NiveauService {

    private final NiveauRepository niveauRepository;

    public List<NiveauResponseDTO> findAll() {
        return niveauRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public NiveauResponseDTO findById(Long id) {
        Niveau niveau = niveauRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Niveau", id));
        return toResponse(niveau);
    }

    @Transactional
    public NiveauResponseDTO create(String name) {
        if (niveauRepository.existsByName(name)) {
            throw new IllegalArgumentException("Le niveau \"" + name + "\" existe déjà");
        }
        Niveau niveau = Niveau.builder().name(name).build();
        // Add default section "A"
        Classe defaultClasse = Classe.builder().niveau(niveau).letter("A").build();
        niveau.getClasses().add(defaultClasse);
        return toResponse(niveauRepository.save(niveau));
    }

    @Transactional
    public void delete(Long id) {
        if (!niveauRepository.existsById(id)) {
            throw new ResourceNotFoundException("Niveau", id);
        }
        niveauRepository.deleteById(id);
    }

    @Transactional
    public NiveauResponseDTO addClasse(Long niveauId, String letter) {
        Niveau niveau = niveauRepository.findById(niveauId)
                .orElseThrow(() -> new ResourceNotFoundException("Niveau", niveauId));

        String upper = letter.toUpperCase().trim();
        boolean exists = niveau.getClasses().stream()
                .anyMatch(c -> c.getLetter().equals(upper));
        if (exists) {
            throw new IllegalArgumentException("La section \"" + upper + "\" existe déjà dans ce niveau");
        }

        Classe classe = Classe.builder().niveau(niveau).letter(upper).build();
        niveau.getClasses().add(classe);
        return toResponse(niveauRepository.save(niveau));
    }

    @Transactional
    public NiveauResponseDTO removeClasse(Long niveauId, String letter) {
        Niveau niveau = niveauRepository.findById(niveauId)
                .orElseThrow(() -> new ResourceNotFoundException("Niveau", niveauId));

        String upper = letter.toUpperCase().trim();
        boolean removed = niveau.getClasses().removeIf(c -> c.getLetter().equals(upper));
        if (!removed) {
            throw new IllegalArgumentException("La section \"" + upper + "\" n'existe pas dans ce niveau");
        }

        return toResponse(niveauRepository.save(niveau));
    }

    private NiveauResponseDTO toResponse(Niveau niveau) {
        List<String> sections = niveau.getClasses().stream()
                .map(Classe::getLetter)
                .sorted()
                .toList();
        return NiveauResponseDTO.builder()
                .id(niveau.getId())
                .name(niveau.getName())
                .sections(sections)
                .build();
    }
}
