package com.schoolSys.schooolSys.discipline;

import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.discipline.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisciplineService {

    private final IncidentRepository incidentRepository;
    private final SanctionRepository sanctionRepository;

    // --- Incident CRUD ---

    public List<IncidentResponseDTO> getAllIncidents() {
        return incidentRepository.findAll().stream()
            .map(this::toIncidentDto)
            .collect(Collectors.toList());
    }

    public IncidentResponseDTO getIncidentById(Long id) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident", id));
        return toIncidentDto(incident);
    }

    public List<IncidentResponseDTO> getIncidentsByDateRange(LocalDate start, LocalDate end) {
        return incidentRepository.findByDateBetween(start, end).stream()
            .map(this::toIncidentDto)
            .collect(Collectors.toList());
    }

    public List<IncidentResponseDTO> getIncidentsByType(String type) {
        return incidentRepository.findByType(type).stream()
            .map(this::toIncidentDto)
            .collect(Collectors.toList());
    }

    public List<IncidentResponseDTO> getIncidentsByGravite(String gravite) {
        return incidentRepository.findByGravite(gravite).stream()
            .map(this::toIncidentDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public IncidentResponseDTO createIncident(IncidentRequestDTO request) {
        Incident incident = Incident.builder()
            .titre(request.getTitre())
            .description(request.getDescription())
            .date(request.getDate())
            .type(request.getType())
            .gravite(request.getGravite())
            .lieu(request.getLieu())
            .signaleParId(request.getSignaleParId())
            .build();

        if (request.getElevesImpliques() != null) {
            List<IncidentEleve> eleves = request.getElevesImpliques().stream()
                .map(dto -> IncidentEleve.builder()
                    .incident(incident)
                    .eleveId(dto.getEleveId())
                    .roleEleve(dto.getRoleEleve())
                    .build())
                .collect(Collectors.toList());
            incident.getElevesImpliques().addAll(eleves);
        }

        return toIncidentDto(incidentRepository.save(incident));
    }

    @Transactional
    public IncidentResponseDTO updateIncident(Long id, IncidentRequestDTO request) {
        Incident incident = incidentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Incident", id));

        incident.setTitre(request.getTitre());
        incident.setDescription(request.getDescription());
        incident.setDate(request.getDate());
        incident.setType(request.getType());
        incident.setGravite(request.getGravite());
        incident.setLieu(request.getLieu());
        incident.setSignaleParId(request.getSignaleParId());

        incident.getElevesImpliques().clear();
        if (request.getElevesImpliques() != null) {
            List<IncidentEleve> eleves = request.getElevesImpliques().stream()
                .map(dto -> IncidentEleve.builder()
                    .incident(incident)
                    .eleveId(dto.getEleveId())
                    .roleEleve(dto.getRoleEleve())
                    .build())
                .collect(Collectors.toList());
            incident.getElevesImpliques().addAll(eleves);
        }

        return toIncidentDto(incidentRepository.save(incident));
    }

    @Transactional
    public void deleteIncident(Long id) {
        if (!incidentRepository.existsById(id)) throw new ResourceNotFoundException("Incident", id);
        incidentRepository.deleteById(id);
    }

    // --- Sanction CRUD ---

    public List<SanctionResponseDTO> getAllSanctions() {
        return sanctionRepository.findAll().stream()
            .map(this::toSanctionDto)
            .collect(Collectors.toList());
    }

    public SanctionResponseDTO getSanctionById(Long id) {
        Sanction sanction = sanctionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sanction", id));
        return toSanctionDto(sanction);
    }

    public List<SanctionResponseDTO> getSanctionsByEleve(Long eleveId) {
        return sanctionRepository.findByEleveId(eleveId).stream()
            .map(this::toSanctionDto)
            .collect(Collectors.toList());
    }

    public List<SanctionResponseDTO> getSanctionsByIncident(Long incidentId) {
        return sanctionRepository.findByIncidentId(incidentId).stream()
            .map(this::toSanctionDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public SanctionResponseDTO createSanction(SanctionRequestDTO request) {
        Incident incident = null;
        if (request.getIncidentId() != null) {
            incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Incident", request.getIncidentId()));
        }

        Sanction sanction = Sanction.builder()
            .eleveId(request.getEleveId())
            .incident(incident)
            .type(request.getType())
            .description(request.getDescription())
            .dateDebut(request.getDateDebut())
            .dateFin(request.getDateFin())
            .decideParId(request.getDecideParId())
            .notifieParents(request.getNotifieParents() != null ? request.getNotifieParents() : false)
            .build();

        return toSanctionDto(sanctionRepository.save(sanction));
    }

    @Transactional
    public SanctionResponseDTO updateSanction(Long id, SanctionRequestDTO request) {
        Sanction sanction = sanctionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sanction", id));

        sanction.setEleveId(request.getEleveId());
        sanction.setType(request.getType());
        sanction.setDescription(request.getDescription());
        sanction.setDateDebut(request.getDateDebut());
        sanction.setDateFin(request.getDateFin());
        sanction.setDecideParId(request.getDecideParId());
        sanction.setNotifieParents(request.getNotifieParents() != null ? request.getNotifieParents() : sanction.getNotifieParents());

        if (request.getIncidentId() != null) {
            Incident incident = incidentRepository.findById(request.getIncidentId())
                .orElseThrow(() -> new ResourceNotFoundException("Incident", request.getIncidentId()));
            sanction.setIncident(incident);
        } else {
            sanction.setIncident(null);
        }

        return toSanctionDto(sanctionRepository.save(sanction));
    }

    @Transactional
    public void deleteSanction(Long id) {
        if (!sanctionRepository.existsById(id)) throw new ResourceNotFoundException("Sanction", id);
        sanctionRepository.deleteById(id);
    }

    // --- Mappers ---

    private IncidentResponseDTO toIncidentDto(Incident i) {
        List<IncidentResponseDTO.IncidentEleveResponseDTO> eleves = i.getElevesImpliques().stream()
            .map(ie -> IncidentResponseDTO.IncidentEleveResponseDTO.builder()
                .id(ie.getId())
                .eleveId(ie.getEleveId())
                .roleEleve(ie.getRoleEleve())
                .build())
            .collect(Collectors.toList());

        return IncidentResponseDTO.builder()
            .id(i.getId())
            .titre(i.getTitre())
            .description(i.getDescription())
            .date(i.getDate())
            .type(i.getType())
            .gravite(i.getGravite())
            .lieu(i.getLieu())
            .signaleParId(i.getSignaleParId())
            .elevesImpliques(eleves)
            .createdAt(i.getCreatedAt())
            .updatedAt(i.getUpdatedAt())
            .build();
    }

    private SanctionResponseDTO toSanctionDto(Sanction s) {
        return SanctionResponseDTO.builder()
            .id(s.getId())
            .eleveId(s.getEleveId())
            .incidentId(s.getIncident() != null ? s.getIncident().getId() : null)
            .type(s.getType())
            .description(s.getDescription())
            .dateDebut(s.getDateDebut())
            .dateFin(s.getDateFin())
            .decideParId(s.getDecideParId())
            .notifieParents(s.getNotifieParents())
            .createdAt(s.getCreatedAt())
            .updatedAt(s.getUpdatedAt())
            .build();
    }
}
