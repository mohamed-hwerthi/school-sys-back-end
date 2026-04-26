package com.schoolSys.schooolSys.module;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.domaine.Domaine;
import com.schoolSys.schooolSys.domaine.DomaineRepository;
import com.schoolSys.schooolSys.domaine.SousDomaine;
import com.schoolSys.schooolSys.domaine.SousDomaineRepository;
import com.schoolSys.schooolSys.module.dto.ModuleRequestDTO;
import com.schoolSys.schooolSys.module.dto.ModuleResponseDTO;
import com.schoolSys.schooolSys.niveau.Niveau;
import com.schoolSys.schooolSys.niveau.NiveauRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final NiveauRepository niveauRepository;
    private final DomaineRepository domaineRepository;
    private final SousDomaineRepository sousDomaineRepository;

    public List<ModuleResponseDTO> findAll(Long niveauId) {
        List<Module> modules;
        if (niveauId != null) {
            modules = moduleRepository.findByNiveauIdOrderByOrdreEtatiqueAsc(niveauId);
        } else {
            modules = moduleRepository.findAllByOrderByNiveauNameAscOrdreEtatiqueAsc();
        }
        return modules.stream().map(this::toResponse).toList();
    }

    public ModuleResponseDTO findById(Long id) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module", id));
        return toResponse(module);
    }

    @Transactional
    public ModuleResponseDTO create(ModuleRequestDTO dto) {
        Niveau niveau = niveauRepository.findById(dto.getNiveauId())
                .orElseThrow(() -> new ResourceNotFoundException("Niveau", dto.getNiveauId()));

        Module module = Module.builder()
                .name(dto.getName())
                .nameVp(dto.getNameVp())
                .nameAr(dto.getNameAr())
                .coeffEtatique(dto.getCoeffEtatique())
                .coeffPrive(dto.getCoeffPrive())
                .ordreEtatique(dto.getOrdreEtatique())
                .ordrePrive(dto.getOrdrePrive())
                .niveau(niveau)
                .domaine(resolveDomaine(dto.getDomaineId()))
                .sousDomaine(resolveSousDomaine(dto.getSousDomaineId()))
                .versionEtatique(dto.getVersionEtatique())
                .versionPrivee(dto.getVersionPrivee())
                .build();

        return toResponse(moduleRepository.save(module));
    }

    @Transactional
    public ModuleResponseDTO update(Long id, ModuleRequestDTO dto) {
        Module module = moduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Module", id));

        if (!module.getNiveau().getId().equals(dto.getNiveauId())) {
            Niveau niveau = niveauRepository.findById(dto.getNiveauId())
                    .orElseThrow(() -> new ResourceNotFoundException("Niveau", dto.getNiveauId()));
            module.setNiveau(niveau);
        }

        module.setName(dto.getName());
        module.setNameVp(dto.getNameVp());
        module.setNameAr(dto.getNameAr());
        module.setCoeffEtatique(dto.getCoeffEtatique());
        module.setCoeffPrive(dto.getCoeffPrive());
        module.setOrdreEtatique(dto.getOrdreEtatique());
        module.setOrdrePrive(dto.getOrdrePrive());
        module.setDomaine(resolveDomaine(dto.getDomaineId()));
        module.setSousDomaine(resolveSousDomaine(dto.getSousDomaineId()));
        module.setVersionEtatique(dto.getVersionEtatique());
        module.setVersionPrivee(dto.getVersionPrivee());

        return toResponse(moduleRepository.save(module));
    }

    @Transactional
    public void delete(Long id) {
        if (!moduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Module", id);
        }
        moduleRepository.deleteById(id);
    }

    private Domaine resolveDomaine(Long domaineId) {
        if (domaineId == null) return null;
        return domaineRepository.findById(domaineId)
                .orElseThrow(() -> new ResourceNotFoundException("Domaine", domaineId));
    }

    private SousDomaine resolveSousDomaine(Long sousDomaineId) {
        if (sousDomaineId == null) return null;
        return sousDomaineRepository.findById(sousDomaineId)
                .orElseThrow(() -> new ResourceNotFoundException("SousDomaine", sousDomaineId));
    }

    private ModuleResponseDTO toResponse(Module module) {
        ModuleResponseDTO.ModuleResponseDTOBuilder builder = ModuleResponseDTO.builder()
                .id(module.getId())
                .name(module.getName())
                .nameVp(module.getNameVp())
                .nameAr(module.getNameAr())
                .coeffEtatique(module.getCoeffEtatique())
                .coeffPrive(module.getCoeffPrive())
                .ordreEtatique(module.getOrdreEtatique())
                .ordrePrive(module.getOrdrePrive())
                .niveauId(module.getNiveau().getId())
                .niveauName(module.getNiveau().getName())
                .versionEtatique(module.getVersionEtatique())
                .versionPrivee(module.getVersionPrivee());

        if (module.getDomaine() != null) {
            builder.domaineId(module.getDomaine().getId())
                    .domaineName(module.getDomaine().getName());
        }
        if (module.getSousDomaine() != null) {
            builder.sousDomaineId(module.getSousDomaine().getId())
                    .sousDomaineName(module.getSousDomaine().getName());
        }

        return builder.build();
    }
}
