package com.schoolSys.schooolSys.auth;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.enabled:false}")
    private boolean mailEnabled;

    @Value("${spring.mail.from:noreply@ecolenet.dev}")
    private String fromAddress;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    /**
     * Send an HTML email. If mail is not enabled or the sender is not configured,
     * falls back to logging the email content.
     */
    public void sendEmail(String to, String subject, String htmlBody) {
        if (!mailEnabled || mailSender == null) {
            log.info("=== EMAIL (mode log - SMTP non configure) ===");
            log.info("To: {}", to);
            log.info("Subject: {}", subject);
            log.info("Body: {}", htmlBody);
            log.info("==============================================");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Email envoye avec succes a: {} (sujet: {})", to, subject);
        } catch (MessagingException e) {
            log.error("Erreur lors de l'envoi de l'email a {}: {}", to, e.getMessage(), e);
        }
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        String subject = "Reinitialisation de votre mot de passe - EcoleNet";
        String htmlBody = """
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Reinitialisation de mot de passe</h2>
                    <p>Vous avez demande la reinitialisation de votre mot de passe.</p>
                    <p>Cliquez sur le lien ci-dessous pour definir un nouveau mot de passe :</p>
                    <p><a href="%s" style="background-color: #4CAF50; color: white; padding: 10px 20px;
                       text-decoration: none; border-radius: 5px;">Reinitialiser mon mot de passe</a></p>
                    <p>Ce lien expire dans 1 heure.</p>
                    <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
                    <hr>
                    <p style="color: #888; font-size: 12px;">EcoleNet - Systeme de gestion scolaire</p>
                </body>
                </html>
                """.formatted(resetLink);

        sendEmail(toEmail, subject, htmlBody);
    }

    /**
     * Sends an absence notification email to a parent.
     */
    public void sendAbsenceNotification(String parentEmail, String studentName, String date, String type) {
        String typeLabel = "RETARD".equals(type) ? "retard" : "absence";
        String subject = "Notification d'" + typeLabel + " - " + studentName;
        String htmlBody = """
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Notification d'%s</h2>
                    <p>Cher(e) parent,</p>
                    <p>Nous vous informons que votre enfant <strong>%s</strong> a ete marque(e) en <strong>%s</strong> le <strong>%s</strong>.</p>
                    <p><a href="%s/dashboard/absences" style="background-color: #2196F3; color: white; padding: 10px 20px;
                       text-decoration: none; border-radius: 5px;">Voir les details</a></p>
                    <hr>
                    <p style="color: #888; font-size: 12px;">EcoleNet - Systeme de gestion scolaire</p>
                </body>
                </html>
                """.formatted(typeLabel, studentName, typeLabel, date, frontendUrl);

        sendEmail(parentEmail, subject, htmlBody);
    }

    /**
     * Sends a discipline incident notification email to a parent.
     */
    public void sendDisciplineIncidentNotification(String parentEmail, String studentName,
                                                    String incidentTitle, String incidentType,
                                                    String gravite, String date, String description) {
        String subject = "Incident disciplinaire - " + studentName;
        String htmlBody = """
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Notification d'incident disciplinaire</h2>
                    <p>Cher(e) parent,</p>
                    <p>Nous vous informons qu'un incident disciplinaire a ete enregistre concernant votre enfant <strong>%s</strong>.</p>
                    <table style="border-collapse: collapse; width: 100%%; margin: 15px 0;">
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Titre</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Type</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Gravite</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Description</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                    </table>
                    <p>Nous vous invitons a prendre contact avec l'etablissement pour en discuter.</p>
                    <hr>
                    <p style="color: #888; font-size: 12px;">EcoleNet - Systeme de gestion scolaire</p>
                </body>
                </html>
                """.formatted(studentName, incidentTitle, incidentType, gravite, date,
                description != null ? description : "N/A");

        sendEmail(parentEmail, subject, htmlBody);
    }

    /**
     * Sends a discipline sanction notification email to a parent.
     */
    public void sendDisciplineSanctionNotification(String parentEmail, String studentName,
                                                    String sanctionType, String dateDebut,
                                                    String dateFin, String description) {
        String subject = "Sanction disciplinaire - " + studentName;
        String htmlBody = """
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Notification de sanction disciplinaire</h2>
                    <p>Cher(e) parent,</p>
                    <p>Nous vous informons qu'une sanction disciplinaire a ete appliquee a votre enfant <strong>%s</strong>.</p>
                    <table style="border-collapse: collapse; width: 100%%; margin: 15px 0;">
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Type de sanction</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date de debut</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date de fin</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Description</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">%s</td></tr>
                    </table>
                    <p>Nous vous invitons a prendre contact avec l'etablissement pour en discuter.</p>
                    <hr>
                    <p style="color: #888; font-size: 12px;">EcoleNet - Systeme de gestion scolaire</p>
                </body>
                </html>
                """.formatted(studentName, sanctionType, dateDebut,
                dateFin != null ? dateFin : "Non definie",
                description != null ? description : "N/A");

        sendEmail(parentEmail, subject, htmlBody);
    }
}
