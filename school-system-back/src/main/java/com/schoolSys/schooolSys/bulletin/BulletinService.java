package com.schoolSys.schooolSys.bulletin;

import com.schoolSys.schooolSys.appreciation.ObservationRepository;
import com.schoolSys.schooolSys.appreciation.ObservationTrimestre;
import com.schoolSys.schooolSys.appreciation.Recommandation;
import com.schoolSys.schooolSys.appreciation.RecommandationRepository;
import com.schoolSys.schooolSys.bulletin.dto.*;
import com.schoolSys.schooolSys.common.exception.ResourceNotFoundException;
import com.schoolSys.schooolSys.domaine.Domaine;
import com.schoolSys.schooolSys.domaine.DomaineRepository;
import com.schoolSys.schooolSys.examen.Examen;
import com.schoolSys.schooolSys.module.Module;
import com.schoolSys.schooolSys.niveau.Classe;
import com.schoolSys.schooolSys.niveau.ClasseRepository;
import com.schoolSys.schooolSys.note.Note;
import com.schoolSys.schooolSys.note.NoteRepository;
import com.schoolSys.schooolSys.student.Student;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BulletinService {

    private final NoteRepository noteRepository;
    private final ClasseRepository classeRepository;
    private final DomaineRepository domaineRepository;
    private final RecommandationRepository recommandationRepository;
    private final ObservationRepository observationRepository;

    private static final String VERSION_PRIVE = "prive";

    /**
     * Compute bulletins for all students in a class for a given trimestre.
     */
    public List<BulletinDTO> getBulletins(Long classeId, Integer trimestre, String version) {
        boolean prive = VERSION_PRIVE.equalsIgnoreCase(version);

        Classe classe = classeRepository.findById(classeId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe", classeId));
        Long niveauId = classe.getNiveau().getId();

        // 1. Fetch all notes for this class/trimestre
        List<Note> allNotes = noteRepository.findByExamenClasseIdAndTrimestre(classeId, trimestre);
        if (allNotes.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Fetch domaines for this niveau
        List<Domaine> domaines = domaineRepository.findByNiveauIdOrderByOrdreAsc(niveauId);
        Map<Long, Domaine> domaineMap = domaines.stream()
                .collect(Collectors.toMap(Domaine::getId, d -> d));

        // 3. Group notes by student
        Map<Long, List<Note>> notesByStudent = allNotes.stream()
                .collect(Collectors.groupingBy(n -> n.getStudent().getId()));

        List<Long> studentIds = new ArrayList<>(notesByStudent.keySet());

        // 4. Fetch recommendations & observations
        List<Recommandation> allRecos = recommandationRepository
                .findByStudentIdInAndTrimestre(studentIds, trimestre);
        Map<Long, List<Recommandation>> recosByStudent = allRecos.stream()
                .collect(Collectors.groupingBy(r -> r.getStudent().getId()));

        List<ObservationTrimestre> allObs = observationRepository
                .findByStudentIdInAndTrimestre(studentIds, trimestre);
        Map<Long, ObservationTrimestre> obsByStudent = allObs.stream()
                .collect(Collectors.toMap(o -> o.getStudent().getId(), o -> o, (a, b) -> b));

        // 5. Compute per-student module averages (needed for class-level stats)
        // Map<studentId, Map<moduleId, moduleAvg>>
        Map<Long, Map<Long, Double>> studentModuleAvgs = new LinkedHashMap<>();
        Map<Long, Double> studentGeneralAvgs = new LinkedHashMap<>();

        for (Map.Entry<Long, List<Note>> entry : notesByStudent.entrySet()) {
            Long studentId = entry.getKey();
            List<Note> studentNotes = entry.getValue();

            Map<Long, List<Note>> byModule = studentNotes.stream()
                    .collect(Collectors.groupingBy(n -> n.getExamen().getModule().getId()));

            Map<Long, Double> moduleAvgs = new LinkedHashMap<>();
            double totalWeighted = 0;
            double totalCoeff = 0;

            for (Map.Entry<Long, List<Note>> moduleEntry : byModule.entrySet()) {
                List<Note> moduleNotes = moduleEntry.getValue();
                Module module = moduleNotes.get(0).getExamen().getModule();

                double sumWeighted = 0;
                double sumCoeff = 0;
                for (Note n : moduleNotes) {
                    if (n.getValeur() != null) {
                        double ec = prive ? n.getExamen().getCoeffPrive() : n.getExamen().getCoeffEtatique();
                        sumWeighted += n.getValeur() * ec;
                        sumCoeff += ec;
                    }
                }

                double avg = sumCoeff > 0 ? round2(sumWeighted / sumCoeff) : 0;
                moduleAvgs.put(moduleEntry.getKey(), avg);

                double mc = prive ? module.getCoeffPrive() : module.getCoeffEtatique();
                totalWeighted += avg * mc;
                totalCoeff += mc;
            }

            studentModuleAvgs.put(studentId, moduleAvgs);
            studentGeneralAvgs.put(studentId, totalCoeff > 0 ? round2(totalWeighted / totalCoeff) : 0.0);
        }

        // 6. Compute class-level stats per module
        // Map<moduleId, List<avg>>
        Map<Long, List<Double>> moduleAvgLists = new LinkedHashMap<>();
        for (Map<Long, Double> avgs : studentModuleAvgs.values()) {
            for (Map.Entry<Long, Double> e : avgs.entrySet()) {
                moduleAvgLists.computeIfAbsent(e.getKey(), k -> new ArrayList<>()).add(e.getValue());
            }
        }

        Map<Long, Double> moduleMinMap = new LinkedHashMap<>();
        Map<Long, Double> moduleMaxMap = new LinkedHashMap<>();
        Map<Long, Double> moduleClasseAvgMap = new LinkedHashMap<>();

        for (Map.Entry<Long, List<Double>> e : moduleAvgLists.entrySet()) {
            List<Double> vals = e.getValue();
            moduleMinMap.put(e.getKey(), vals.stream().mapToDouble(Double::doubleValue).min().orElse(0));
            moduleMaxMap.put(e.getKey(), vals.stream().mapToDouble(Double::doubleValue).max().orElse(0));
            moduleClasseAvgMap.put(e.getKey(), round2(vals.stream().mapToDouble(Double::doubleValue).average().orElse(0)));
        }

        // 7. Compute class-level general stats
        List<Double> allGeneralAvgs = new ArrayList<>(studentGeneralAvgs.values());
        double classeAvg = round2(allGeneralAvgs.stream().mapToDouble(Double::doubleValue).average().orElse(0));
        double classeMin = allGeneralAvgs.stream().mapToDouble(Double::doubleValue).min().orElse(0);
        double classeMax = allGeneralAvgs.stream().mapToDouble(Double::doubleValue).max().orElse(0);
        int totalEleves = studentGeneralAvgs.size();

        // 8. Compute ranks (descending by moyenne)
        List<Map.Entry<Long, Double>> ranked = new ArrayList<>(studentGeneralAvgs.entrySet());
        ranked.sort((a, b) -> Double.compare(b.getValue(), a.getValue()));
        Map<Long, Integer> rankMap = new LinkedHashMap<>();
        for (int i = 0; i < ranked.size(); i++) {
            // Same average = same rank
            if (i > 0 && Objects.equals(ranked.get(i).getValue(), ranked.get(i - 1).getValue())) {
                rankMap.put(ranked.get(i).getKey(), rankMap.get(ranked.get(i - 1).getKey()));
            } else {
                rankMap.put(ranked.get(i).getKey(), i + 1);
            }
        }

        // 9. Build the fullName for this classe
        String fullName = buildFullName(classe);

        // 10. Build BulletinDTO per student
        List<BulletinDTO> bulletins = new ArrayList<>();

        for (Map.Entry<Long, List<Note>> entry : notesByStudent.entrySet()) {
            Long studentId = entry.getKey();
            List<Note> studentNotes = entry.getValue();
            Student student = studentNotes.get(0).getStudent();

            // Group notes by module
            Map<Long, List<Note>> byModule = studentNotes.stream()
                    .collect(Collectors.groupingBy(n -> n.getExamen().getModule().getId()));

            // Build module DTOs
            Map<Long, BulletinModuleDTO> moduleDTOs = new LinkedHashMap<>();
            for (Map.Entry<Long, List<Note>> moduleEntry : byModule.entrySet()) {
                Long moduleId = moduleEntry.getKey();
                List<Note> moduleNotes = moduleEntry.getValue();
                Module module = moduleNotes.get(0).getExamen().getModule();

                List<BulletinExamenDTO> examenDTOs = moduleNotes.stream()
                        .sorted(Comparator.comparingInt(n ->
                                prive ? n.getExamen().getOrdrePrive() : n.getExamen().getOrdreEtatique()))
                        .map(n -> BulletinExamenDTO.builder()
                                .examenId(n.getExamen().getId())
                                .examenName(prive && n.getExamen().getNamePrive() != null
                                        ? n.getExamen().getNamePrive() : n.getExamen().getName())
                                .coeff(prive ? n.getExamen().getCoeffPrive() : n.getExamen().getCoeffEtatique())
                                .note(n.getValeur())
                                .build())
                        .toList();

                double moduleAvg = studentModuleAvgs.get(studentId).getOrDefault(moduleId, 0.0);

                moduleDTOs.put(moduleId, BulletinModuleDTO.builder()
                        .moduleId(moduleId)
                        .moduleName(prive && module.getNameVp() != null ? module.getNameVp() : module.getName())
                        .coeff(prive ? module.getCoeffPrive() : module.getCoeffEtatique())
                        .ordre(prive ? module.getOrdrePrive() : module.getOrdreEtatique())
                        .examens(examenDTOs)
                        .moyenneModule(moduleAvg)
                        .moduleMin(round2(moduleMinMap.getOrDefault(moduleId, 0.0)))
                        .moduleMax(round2(moduleMaxMap.getOrDefault(moduleId, 0.0)))
                        .moduleClasseAvg(moduleClasseAvgMap.getOrDefault(moduleId, 0.0))
                        .build());
            }

            // Group modules into domaines
            List<BulletinDomaineDTO> domaineDTOs = new ArrayList<>();
            List<BulletinModuleDTO> horsDomaine = new ArrayList<>();

            // Recommendations for this student
            Map<Long, String> recoTexts = new LinkedHashMap<>();
            List<Recommandation> studentRecos = recosByStudent.getOrDefault(studentId, Collections.emptyList());
            for (Recommandation r : studentRecos) {
                recoTexts.put(r.getDomaine().getId(), r.getTexte());
            }

            for (Domaine domaine : domaines) {
                List<BulletinModuleDTO> domaineModules = moduleDTOs.entrySet().stream()
                        .filter(e -> {
                            // Find the module entity from any note
                            Module mod = byModule.containsKey(e.getKey())
                                    ? byModule.get(e.getKey()).get(0).getExamen().getModule()
                                    : null;
                            return mod != null && mod.getDomaine() != null
                                    && mod.getDomaine().getId().equals(domaine.getId());
                        })
                        .map(Map.Entry::getValue)
                        .sorted(Comparator.comparingInt(BulletinModuleDTO::getOrdre))
                        .toList();

                if (domaineModules.isEmpty()) continue;

                // Domain average = weighted avg of module averages
                double domWeighted = 0, domCoeffSum = 0;
                for (BulletinModuleDTO m : domaineModules) {
                    domWeighted += m.getMoyenneModule() * m.getCoeff();
                    domCoeffSum += m.getCoeff();
                }
                double domaineAvg = domCoeffSum > 0 ? round2(domWeighted / domCoeffSum) : 0;

                domaineDTOs.add(BulletinDomaineDTO.builder()
                        .domaineId(domaine.getId())
                        .domaineName(domaine.getName())
                        .domaineNameAr(domaine.getNameAr())
                        .ordre(domaine.getOrdre())
                        .modules(domaineModules)
                        .moyenneDomaine(domaineAvg)
                        .recommandation(recoTexts.get(domaine.getId()))
                        .build());
            }

            // Modules not assigned to any domaine
            Set<Long> assignedModuleIds = domaineDTOs.stream()
                    .flatMap(d -> d.getModules().stream())
                    .map(BulletinModuleDTO::getModuleId)
                    .collect(Collectors.toSet());

            for (Map.Entry<Long, BulletinModuleDTO> e : moduleDTOs.entrySet()) {
                if (!assignedModuleIds.contains(e.getKey())) {
                    horsDomaine.add(e.getValue());
                }
            }
            horsDomaine.sort(Comparator.comparingInt(BulletinModuleDTO::getOrdre));

            double moyenneGenerale = studentGeneralAvgs.getOrDefault(studentId, 0.0);

            // Observation
            ObservationTrimestre obs = obsByStudent.get(studentId);
            String comportement = obs != null ? obs.getComportement() : null;
            String certificatObs = obs != null ? obs.getCertificatType() : null;

            // Auto-determine certificate if not manually set
            String certificat = certificatObs != null ? certificatObs : determineCertificat(moyenneGenerale);

            // Arabic name
            String nameAr = null;
            if (student.getFirstNameAr() != null && student.getLastNameAr() != null) {
                nameAr = student.getFirstNameAr() + " " + student.getLastNameAr();
            }

            bulletins.add(BulletinDTO.builder()
                    .studentId(studentId)
                    .studentName(student.getFirstName() + " " + student.getLastName())
                    .studentNameAr(nameAr)
                    .classe(fullName)
                    .niveau(classe.getNiveau().getName())
                    .trimestre(trimestre)
                    .version(prive ? "prive" : "etatique")
                    .domaines(domaineDTOs)
                    .modulesHorsDomaine(horsDomaine)
                    .moyenneGenerale(moyenneGenerale)
                    .moyenneClasse(classeAvg)
                    .moyenneMin(round2(classeMin))
                    .moyenneMax(round2(classeMax))
                    .rang(rankMap.getOrDefault(studentId, 0))
                    .totalEleves(totalEleves)
                    .certificatType(certificat)
                    .comportement(comportement)
                    .build());
        }

        bulletins.sort(Comparator.comparing(BulletinDTO::getStudentName));
        return bulletins;
    }

    /**
     * Get a single student's bulletin.
     */
    public BulletinDTO getBulletin(Long classeId, Long studentId, Integer trimestre, String version) {
        List<BulletinDTO> all = getBulletins(classeId, trimestre, version);
        return all.stream()
                .filter(b -> b.getStudentId().equals(studentId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Bulletin for student", studentId));
    }

    // ── Helpers ────────────────────────────────────────────

    private String determineCertificat(double moyenne) {
        if (moyenne >= 18) return "شهادة شرف الدرجة الأولى";
        if (moyenne >= 16) return "شهادة شرف";
        if (moyenne >= 14) return "شهادة شكر";
        if (moyenne >= 12) return "شهادة تشجيع";
        return null;
    }

    private String buildFullName(Classe classe) {
        String niveauName = classe.getNiveau().getName();
        StringBuilder digits = new StringBuilder();
        for (char ch : niveauName.toCharArray()) {
            if (Character.isDigit(ch)) digits.append(ch);
            else break;
        }
        return digits.toString() + classe.getLetter();
    }

    private double round2(double val) {
        return Math.round(val * 100.0) / 100.0;
    }
}
