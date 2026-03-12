package com.schoolSys.schooolSys.integration;

import com.schoolSys.schooolSys.integration.dto.EmailRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Email sending service.
 * Currently stubbed with logging. When JavaMailSender is configured,
 * actual sending can be enabled.
 */
@Service
@Slf4j
public class EmailService {

    public boolean send(EmailRequest request) {
        log.info("Envoi email a: {}, sujet: {}, corps: {} caracteres",
                request.getTo(), request.getSubject(),
                request.getBody() != null ? request.getBody().length() : 0);

        // Stubbed: in production, use JavaMailSender
        // mailSender.send(message);

        log.info("Email envoye avec succes (stub) a: {}", request.getTo());
        return true;
    }

    public boolean sendTemplate(String templateType, Map<String, String> params) {
        log.info("Envoi email template: {} avec {} parametres", templateType, params.size());

        String to = params.getOrDefault("to", "");
        String subject = params.getOrDefault("subject", "Notification");
        String body = buildTemplateBody(templateType, params);

        EmailRequest request = EmailRequest.builder()
                .to(to)
                .subject(subject)
                .body(body)
                .templateType(templateType)
                .build();

        return send(request);
    }

    private String buildTemplateBody(String templateType, Map<String, String> params) {
        return switch (templateType) {
            case "WELCOME" -> "Bienvenue " + params.getOrDefault("name", "") + " dans notre etablissement.";
            case "ABSENCE_ALERT" -> "Alerte absence pour l'eleve " + params.getOrDefault("studentName", "") +
                    ". Nombre d'absences: " + params.getOrDefault("count", "0");
            case "PAYMENT_REMINDER" -> "Rappel de paiement pour " + params.getOrDefault("studentName", "") +
                    ". Montant du: " + params.getOrDefault("amount", "0") + " DH";
            case "GRADE_NOTIFICATION" -> "Les notes du " + params.getOrDefault("trimestre", "") +
                    " sont disponibles pour " + params.getOrDefault("studentName", "");
            default -> "Notification: " + params.getOrDefault("message", "");
        };
    }
}
