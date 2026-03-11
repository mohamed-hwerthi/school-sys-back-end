package com.schoolSys.schooolSys.domaine;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.domaine.dto.*;
import com.schoolSys.schooolSys.niveau.Niveau;
import com.schoolSys.schooolSys.niveau.NiveauRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DomaineService {

    private final DomaineRepository domaineRepository;
    private final SousDomaineRepository sousDomaineRepository;
    private final NiveauRepository niveauRepository;

    // ── Domaines ────────────────────────────────────────────

    public List<DomaineResponseDTO> findAll(Long niveauId) {
        List<Domaine> list = niveauId != null
                ? domaineRepository.findByNiveauIdOrderByOrdreAsc(niveauId)
                : domaineRepository.findAllByOrderByNiveauNameAscOrdreAsc();
        return list.stream().map(this::toResponse).toList();
    }

    public DomaineResponseDTO findById(Long id) {
        Domaine d = domaineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Domaine", id));
        return toResponse(d);
    }

    @Transactional
    public DomaineResponseDTO create(DomaineRequestDTO dto) {
        Niveau niveau = niveauRepository.findById(dto.getNiveauId())
                .orElseThrow(() -> new ResourceNotFoundException("Niveau", dto.getNiveauId()));

        Domaine domaine = Domaine.builder()
                .name(dto.getName())
                .nameAr(dto.getNameAr())
                .ordre(dto.getOrdre())
                .niveau(niveau)
                .build();

        return toResponse(domaineRepository.save(domaine));
    }

    @Transactional
    public DomaineResponseDTO update(Long id, DomaineRequestDTO dto) {
        Domaine domaine = domaineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Domaine", id));

        if (!domaine.getNiveau().getId().equals(dto.getNiveauId())) {
            Niveau niveau = niveauRepository.findById(dto.getNiveauId())
                    .orElseThrow(() -> new ResourceNotFoundException("Niveau", dto.getNiveauId()));
            domaine.setNiveau(niveau);
        }

        domaine.setName(dto.getName());
        domaine.setNameAr(dto.getNameAr());
        domaine.setOrdre(dto.getOrdre());

        return toResponse(domaineRepository.save(domaine));
    }

    @Transactional
    public void delete(Long id) {
        if (!domaineRepository.existsById(id)) {
            throw new ResourceNotFoundException("Domaine", id);
        }
        domaineRepository.deleteById(id);
    }

    // ── Sous-domaines ───────────────────────────────────────

    public List<SousDomaineDTO> findSousDomaines(Long domaineId) {
        return sousDomaineRepository.findByDomaineIdOrderByOrdreAsc(domaineId)
                .stream().map(this::toSousDomaineDTO).toList();
    }

    @Transactional
    public SousDomaineDTO createSousDomaine(SousDomaineRequestDTO dto) {
        Domaine domaine = domaineRepository.findById(dto.getDomaineId())
                .orElseThrow(() -> new ResourceNotFoundException("Domaine", dto.getDomaineId()));

        SousDomaine sd = SousDomaine.builder()
                .name(dto.getName())
                .nameAr(dto.getNameAr())
                .ordre(dto.getOrdre())
                .domaine(domaine)
                .build();

        return toSousDomaineDTO(sousDomaineRepository.save(sd));
    }

    @Transactional
    public SousDomaineDTO updateSousDomaine(Long id, SousDomaineRequestDTO dto) {
        SousDomaine sd = sousDomaineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SousDomaine", id));

        if (!sd.getDomaine().getId().equals(dto.getDomaineId())) {
            Domaine domaine = domaineRepository.findById(dto.getDomaineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Domaine", dto.getDomaineId()));
            sd.setDomaine(domaine);
        }

        sd.setName(dto.getName());
        sd.setNameAr(dto.getNameAr());
        sd.setOrdre(dto.getOrdre());

        return toSousDomaineDTO(sousDomaineRepository.save(sd));
    }

    @Transactional
    public void deleteSousDomaine(Long id) {
        if (!sousDomaineRepository.existsById(id)) {
            throw new ResourceNotFoundException("SousDomaine", id);
        }
        sousDomaineRepository.deleteById(id);
    }

    // ── Mapping ─────────────────────────────────────────────

    private DomaineResponseDTO toResponse(Domaine d) {
        return DomaineResponseDTO.builder()
                .id(d.getId())
                .name(d.getName())
                .nameAr(d.getNameAr())
                .ordre(d.getOrdre())
                .niveauId(d.getNiveau().getId())
                .niveauName(d.getNiveau().getName())
                .sousDomaines(d.getSousDomaines().stream().map(this::toSousDomaineDTO).toList())
                .build();
    }

    private SousDomaineDTO toSousDomaineDTO(SousDomaine sd) {
        return SousDomaineDTO.builder()
                .id(sd.getId())
                .name(sd.getName())
                .nameAr(sd.getNameAr())
                .ordre(sd.getOrdre())
                .domaineId(sd.getDomaine().getId())
                .build();
    }
}
