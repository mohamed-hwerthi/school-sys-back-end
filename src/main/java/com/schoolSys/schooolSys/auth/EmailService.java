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
}
