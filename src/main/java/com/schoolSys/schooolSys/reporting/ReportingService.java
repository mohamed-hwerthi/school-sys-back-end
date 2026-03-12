package com.schoolSys.schooolSys.reporting;

import com.schoolSys.schooolSys.absence.AbsenceRepository;
import com.schoolSys.schooolSys.finance.PaiementRepository;
import com.schoolSys.schooolSys.niveau.ClasseRepository;
import com.schoolSys.schooolSys.note.NoteRepository;
import com.schoolSys.schooolSys.reporting.dto.DashboardStatsDTO;
import com.schoolSys.schooolSys.reporting.dto.MonthlyTrendDTO;
import com.schoolSys.schooolSys.student.Student;
import com.schoolSys.schooolSys.student.StudentRepository;
import com.schoolSys.schooolSys.teacher.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportingService {

    private final NoteRepository noteRepository;
    private final PaiementRepository paiementRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final ClasseRepository classeRepository;
    private final AbsenceRepository absenceRepository;

    public DashboardStatsDTO getDashboardStats(String anneeScolaire) {
        long totalStudents = studentRepository.count();
        long totalTeachers = teacherRepository.count();
        long totalClasses = classeRepository.count();

        // Payment stats
        BigDecimal totalRevenue = paiementRepository.sumMontantPayeByAnneeScolaire(anneeScolaire);
        BigDecimal totalDu = paiementRepository.sumMontantDuByAnneeScolaire(anneeScolaire);
        BigDecimal totalPending = paiementRepository.sumImpayes(anneeScolaire);
        BigDecimal tauxRecouvrement = totalDu.compareTo(BigDecimal.ZERO) > 0
                ? totalRevenue.multiply(BigDecimal.valueOf(100)).divide(totalDu, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Absence rate
        long totalAbsences = absenceRepository.count();
        double tauxAbsence = totalStudents > 0
                ? Math.round((double) totalAbsences / totalStudents * 100.0 * 10.0) / 10.0
                : 0;

        // Average grade
        double moyenneGenerale = noteRepository.findAll().stream()
                .filter(n -> n.getValeur() != null)
                .mapToDouble(n -> n.getValeur())
                .average()
                .orElse(0);
        moyenneGenerale = Math.round(moyenneGenerale * 10.0) / 10.0;

        // Students by niveau
        Map<String, Long> studentsByNiveau = studentRepository.findAll().stream()
                .filter(s -> s.getNiveau() != null && !s.getNiveau().isBlank())
                .collect(Collectors.groupingBy(Student::getNiveau, Collectors.counting()));

        return DashboardStatsDTO.builder()
                .totalStudents(totalStudents)
                .totalTeachers(totalTeachers)
                .totalClasses(totalClasses)
                .totalRevenue(totalRevenue)
                .totalPending(totalPending)
                .tauxRecouvrement(tauxRecouvrement)
                .tauxAbsence(tauxAbsence)
                .moyenneGenerale(moyenneGenerale)
                .studentsByNiveau(studentsByNiveau)
                .build();
    }

    public List<MonthlyTrendDTO> getMonthlyTrends(String anneeScolaire) {
        List<MonthlyTrendDTO> trends = new ArrayList<>();
        Locale fr = Locale.FRENCH;

        // Parse year range (e.g., "2025-2026")
        int startYear;
        int endYear;
        try {
            String[] parts = anneeScolaire.split("-");
            startYear = Integer.parseInt(parts[0]);
            endYear = parts.length > 1 ? Integer.parseInt(parts[1]) : startYear + 1;
        } catch (Exception e) {
            startYear = 2025;
            endYear = 2026;
        }

        // Academic year: September to June
        int[][] monthYears = {
                {9, startYear}, {10, startYear}, {11, startYear}, {12, startYear},
                {1, endYear}, {2, endYear}, {3, endYear}, {4, endYear},
                {5, endYear}, {6, endYear}
        };

        List<Long> allStudentIds = studentRepository.findAll().stream()
                .map(Student::getId)
                .toList();

        for (int[] my : monthYears) {
            int month = my[0];
            int year = my[1];

            String monthName = Month.of(month).getDisplayName(TextStyle.SHORT, fr);
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            // Inscriptions count for this month
            long inscriptions = studentRepository.findAll().stream()
                    .filter(s -> s.getEnrollmentDate() != null
                            && s.getEnrollmentDate().getMonthValue() == month
                            && s.getEnrollmentDate().getYear() == year)
                    .count();

            // Payment total for this month
            String moisKey = String.format("%02d/%d", month, year);
            BigDecimal paiements = paiementRepository.sumMontantPayeByMoisAndAnneeScolaire(moisKey, anneeScolaire);

            // Absences count for this month
            long absences = 0;
            if (!allStudentIds.isEmpty()) {
                try {
                    absences = absenceRepository.findByEleveIdInAndMonthAndYear(allStudentIds, month, year).size();
                } catch (Exception ignored) {
                    // If the query fails due to empty list, default to 0
                }
            }

            trends.add(MonthlyTrendDTO.builder()
                    .month(monthName)
                    .inscriptions(inscriptions)
                    .paiements(paiements)
                    .absences(absences)
                    .build());
        }

        return trends;
    }
}
