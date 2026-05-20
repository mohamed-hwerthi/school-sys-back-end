package com.schoolSys.schooolSys.cantine;

import java.util.UUID;

import com.schoolSys.schooolSys.cantine.dto.CantineStatsDTO;
import com.schoolSys.schooolSys.cantine.dto.PointageBatchRequest;
import com.schoolSys.schooolSys.cantine.dto.PointageRepasDTO;
import com.schoolSys.schooolSys.common.security.CurrentUserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PointageRepasService {

    private final PointageRepasRepository pointageRepository;
    private final AbonnementCantineRepository abonnementRepository;
    private final CurrentUserContext currentUserContext;

    public List<PointageRepasDTO> getByDate(LocalDate date) {
        return pointageRepository.findByDateRepas(date).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PointageRepasDTO> getByDateAndType(LocalDate date, String typeRepas) {
        return pointageRepository.findByDateRepasAndTypeRepas(date, typeRepas).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PointageRepasDTO> getByEleve(UUID eleveId) {
        currentUserContext.assertCanAccessStudent(eleveId);
        return pointageRepository.findByEleveId(eleveId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<PointageRepasDTO> pointer(PointageBatchRequest request) {
        String typeRepas = request.getTypeRepas() != null ? request.getTypeRepas() : "DEJEUNER";

        List<PointageRepas> pointages = request.getPointages().stream()
                .map(item -> PointageRepas.builder()
                        .eleveId(item.getEleveId())
                        .dateRepas(request.getDateRepas())
                        .typeRepas(typeRepas)
                        .present(item.getPresent() != null ? item.getPresent() : true)
                        .build())
                .collect(Collectors.toList());

        return pointageRepository.saveAll(pointages).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public CantineStatsDTO getStats() {
        LocalDate today = LocalDate.now();
        long totalAbonnes = abonnementRepository.countActifs();
        long repasAujourdHui = pointageRepository.countPresentsByDate(today);
        long totalPointages = pointageRepository.countByDate(today);
        double tauxPresence = totalPointages > 0
                ? Math.round((double) repasAujourdHui / totalPointages * 100.0 * 100.0) / 100.0
                : 0.0;
        BigDecimal revenuesMensuel = abonnementRepository.sumMontantActifs();

        return CantineStatsDTO.builder()
                .totalAbonnes(totalAbonnes)
                .repasAujourdHui(repasAujourdHui)
                .tauxPresence(tauxPresence)
                .revenuesMensuel(revenuesMensuel != null ? revenuesMensuel : BigDecimal.ZERO)
                .build();
    }

    private PointageRepasDTO toDto(PointageRepas p) {
        return PointageRepasDTO.builder()
                .id(p.getId())
                .eleveId(p.getEleveId())
                .dateRepas(p.getDateRepas())
                .typeRepas(p.getTypeRepas())
                .present(p.getPresent())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
