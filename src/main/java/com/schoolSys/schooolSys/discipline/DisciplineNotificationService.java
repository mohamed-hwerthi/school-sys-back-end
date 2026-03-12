package com.schoolSys.schooolSys.discipline;

import com.schoolSys.schooolSys.auth.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisciplineNotificationService {

    private final EmailService emailService;

    /**
     * Notify parent about a discipline incident involving their child.
     */
    public void notifyParentIncident(Incident incident, Long eleveId) {
        log.info("=== NOTIFICATION PARENT - INCIDENT ===");
        log.info("Incident: {} (ID: {})", incident.getTitre(), incident.getId());
        log.info("Type: {}, Gravite: {}", incident.getType(), incident.getGravite());
        log.info("Eleve ID: {}", eleveId);
        log.info("Date: {}", incident.getDate());
        log.info("Description: {}", incident.getDescription());
        log.info("=======================================");
        // TODO: When SMTP is configured, use emailService to send actual email to parent
        // emailService.sendDisciplineNotification(parentEmail, subject, body);
    }

    /**
     * Notify parent about a sanction applied to their child.
     */
    public void notifyParentSanction(Sanction sanction) {
        log.info("=== NOTIFICATION PARENT - SANCTION ===");
        log.info("Sanction ID: {}", sanction.getId());
        log.info("Type: {}, Niveau: {}", sanction.getType(), sanction.getNiveau());
        log.info("Eleve ID: {}", sanction.getEleveId());
        log.info("Date debut: {}", sanction.getDateDebut());
        log.info("Date fin: {}", sanction.getDateFin());
        log.info("Description: {}", sanction.getDescription());
        log.info("======================================");
        // TODO: When SMTP is configured, use emailService to send actual email to parent
        // emailService.sendDisciplineNotification(parentEmail, subject, body);
    }
}
