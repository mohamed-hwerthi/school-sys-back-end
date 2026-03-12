package com.schoolSys.schooolSys.auth;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        log.info("=== PASSWORD RESET EMAIL ===");
        log.info("To: {}", toEmail);
        log.info("Password reset link: {}", resetLink);
        log.info("============================");
    }

    /**
     * Sends an absence notification email to a parent.
     * Currently logs the notification (SMTP not configured yet).
     */
    public void sendAbsenceNotification(String parentEmail, String studentName, String date, String type) {
        String typeLabel = "RETARD".equals(type) ? "retard" : "absence";
        log.info("=== ABSENCE NOTIFICATION EMAIL ===");
        log.info("To: {}", parentEmail);
        log.info("Subject: Notification d'{} - {}", typeLabel, studentName);
        log.info("Body: Cher(e) parent, nous vous informons que votre enfant {} a ete marque(e) en {} le {}.",
                studentName, typeLabel, date);
        log.info("Link: {}/dashboard/absences", frontendUrl);
        log.info("==================================");
    }
}
