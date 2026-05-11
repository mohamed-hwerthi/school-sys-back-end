package com.schoolSys.schooolSys.volumehoraire;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModuleClasseVolumeRepository
        extends JpaRepository<ModuleClasseVolume, Long> {

    List<ModuleClasseVolume> findByClasseId(Long classeId);

    List<ModuleClasseVolume> findByAnneeScolaireId(Long anneeScolaireId);

    List<ModuleClasseVolume> findByClasseIdAndAnneeScolaireId(Long classeId, Long anneeScolaireId);

    Optional<ModuleClasseVolume> findByModuleIdAndClasseIdAndAnneeScolaireId(
            Long moduleId, Long classeId, Long anneeScolaireId);
}
