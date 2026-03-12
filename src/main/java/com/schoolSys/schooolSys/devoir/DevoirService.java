package com.schoolSys.schooolSys.devoir;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.devoir.dto.CreateDevoirRequest;
import com.schoolSys.schooolSys.devoir.dto.DevoirDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DevoirService {

    private final DevoirRepository devoirRepository;
    private final SoumissionRepository soumissionRepository;

    public List<DevoirDTO> findAll(Long classeId, Long moduleId) {
        List<Devoir> devoirs;
        if (classeId != null && moduleId != null) {
            devoirs = devoirRepository.findByClasseIdAndModuleIdOrderByDateLimiteDesc(classeId, moduleId);
        } else if (classeId != null) {
            devoirs = devoirRepository.findByClasseIdOrderByDateLimiteDesc(classeId);
        } else if (moduleId != null) {
            devoirs = devoirRepository.findByModuleIdOrderByDateLimiteDesc(moduleId);
        } else {
            devoirs = devoirRepository.findAllByOrderByDateLimiteDesc();
        }
        return devoirs.stream().map(this::toDTO).toList();
    }

    public DevoirDTO findById(Long id) {
        Devoir devoir = devoirRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devoir", id));
        return toDTO(devoir);
    }

    public List<DevoirDTO> findByClasse(Long classeId) {
        return devoirRepository.findByClasseIdOrderByDateLimiteDesc(classeId)
                .stream().map(this::toDTO).toList();
    }

    public List<DevoirDTO> findByModule(Long moduleId) {
        return devoirRepository.findByModuleIdOrderByDateLimiteDesc(moduleId)
                .stream().map(this::toDTO).toList();
    }

    @Transactional
    public DevoirDTO create(CreateDevoirRequest request) {
        Devoir devoir = Devoir.builder()
                .titre(request.getTitre())
                .description(request.getDescription())
                .moduleId(request.getModuleId())
                .classeId(request.getClasseId())
                .enseignantId(request.getEnseignantId())
                .datePublication(request.getDatePublication() != null ? request.getDatePublication() : LocalDate.now())
                .dateLimite(request.getDateLimite())
                .type(request.getType())
                .pointsMax(request.getPointsMax())
                .fichierUrl(request.getFichierUrl())
                .statut(request.getStatut())
                .build();
        return toDTO(devoirRepository.save(devoir));
    }

    @Transactional
    public DevoirDTO update(Long id, CreateDevoirRequest request) {
        Devoir devoir = devoirRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devoir", id));

        devoir.setTitre(request.getTitre());
        devoir.setDescription(request.getDescription());
        devoir.setModuleId(request.getModuleId());
        devoir.setClasseId(request.getClasseId());
        devoir.setEnseignantId(request.getEnseignantId());
        if (request.getDatePublication() != null) {
            devoir.setDatePublication(request.getDatePublication());
        }
        devoir.setDateLimite(request.getDateLimite());
        devoir.setType(request.getType());
        devoir.setPointsMax(request.getPointsMax());
        devoir.setFichierUrl(request.getFichierUrl());
        devoir.setStatut(request.getStatut());
        devoir.setUpdatedAt(LocalDateTime.now());

        return toDTO(devoirRepository.save(devoir));
    }

    @Transactional
    public void delete(Long id) {
        if (!devoirRepository.existsById(id)) {
            throw new ResourceNotFoundException("Devoir", id);
        }
        devoirRepository.deleteById(id);
    }

    @Transactional
    public DevoirDTO closeDevoir(Long id) {
        Devoir devoir = devoirRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devoir", id));
        devoir.setStatut("FERME");
        devoir.setUpdatedAt(LocalDateTime.now());
        return toDTO(devoirRepository.save(devoir));
    }

    private DevoirDTO toDTO(Devoir devoir) {
        long totalSoumissions = soumissionRepository.countByDevoirId(devoir.getId());
        return DevoirDTO.builder()
                .id(devoir.getId())
                .titre(devoir.getTitre())
                .description(devoir.getDescription())
                .moduleId(devoir.getModuleId())
                .classeId(devoir.getClasseId())
                .enseignantId(devoir.getEnseignantId())
                .datePublication(devoir.getDatePublication())
                .dateLimite(devoir.getDateLimite())
                .type(devoir.getType())
                .pointsMax(devoir.getPointsMax())
                .fichierUrl(devoir.getFichierUrl())
                .statut(devoir.getStatut())
                .totalSoumissions(totalSoumissions)
                .createdAt(devoir.getCreatedAt())
                .updatedAt(devoir.getUpdatedAt())
                .build();
    }
}
