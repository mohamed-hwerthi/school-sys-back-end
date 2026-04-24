package com.schoolSys.schooolSys.settings;

import com.schoolSys.schooolSys.settings.dto.SchoolSettingsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SchoolSettingsService {

    private final SchoolSettingsRepository repository;

    public SchoolSettingsDTO getSettings() {
        SchoolSettings s = getOrCreate();
        return toDTO(s);
    }

    @Transactional
    public SchoolSettingsDTO updateSettings(SchoolSettingsDTO dto) {
        SchoolSettings s = getOrCreate();
        s.setSchoolName(dto.getSchoolName());
        s.setSchoolNameAr(dto.getSchoolNameAr());
        s.setAnneeScolaire(dto.getAnneeScolaire());
        s.setAdresse(dto.getAdresse());
        s.setTelephone(dto.getTelephone());
        s.setDirecteurName(dto.getDirecteurName());
        s.setDirecteurNameAr(dto.getDirecteurNameAr());
        s.setLogo(dto.getLogo());
        s.setVille(dto.getVille());
        s.setVilleAr(dto.getVilleAr());
        s.setEmail(dto.getEmail());
        s.setSiteWeb(dto.getSiteWeb());
        s.setAnneeCreation(dto.getAnneeCreation());
        s.setDescription(dto.getDescription());
        s.setUpdatedAt(LocalDateTime.now());
        return toDTO(repository.save(s));
    }

    private SchoolSettings getOrCreate() {
        return repository.findAll().stream().findFirst()
                .orElseGet(() -> repository.save(SchoolSettings.builder().build()));
    }

    private SchoolSettingsDTO toDTO(SchoolSettings s) {
        return SchoolSettingsDTO.builder()
                .schoolName(s.getSchoolName())
                .schoolNameAr(s.getSchoolNameAr())
                .anneeScolaire(s.getAnneeScolaire())
                .adresse(s.getAdresse())
                .telephone(s.getTelephone())
                .directeurName(s.getDirecteurName())
                .directeurNameAr(s.getDirecteurNameAr())
                .logo(s.getLogo())
                .ville(s.getVille())
                .villeAr(s.getVilleAr())
                .email(s.getEmail())
                .siteWeb(s.getSiteWeb())
                .anneeCreation(s.getAnneeCreation())
                .description(s.getDescription())
                .build();
    }
}
