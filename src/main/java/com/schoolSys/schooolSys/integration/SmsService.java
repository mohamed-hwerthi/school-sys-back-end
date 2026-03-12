package com.schoolSys.schooolSys.integration;

import com.schoolSys.schooolSys.integration.dto.SmsRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * SMS sending service.
 * Stubbed with logging. Connect to a real SMS provider (Twilio, Vonage, etc.)
 * in production.
 */
@Service
@Slf4j
public class SmsService {

    public boolean send(SmsRequest request) {
        log.info("Envoi SMS au: {}, message: {} caracteres",
                request.getPhoneNumber(),
                request.getMessage() != null ? request.getMessage().length() : 0);

        // Stubbed: in production, call the SMS provider API
        // smsProvider.send(request.getPhoneNumber(), request.getMessage());

        log.info("SMS envoye avec succes (stub) au: {}", request.getPhoneNumber());
        return true;
    }
}
