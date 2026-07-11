package com.mediequip.marketplace.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class NotificationService {

    public void sendEmail(String toEmail, String subject, String messageContent) {
        log.info("[MOCK EMAIL] To: {}, Subject: {}, Content: {}", toEmail, subject, messageContent);
    }

    public void sendSms(String toPhone, String smsContent) {
        log.info("[MOCK SMS] To: {}, Content: {}", toPhone, smsContent);
    }

    public void sendNotification(String toEmail, String toPhone, String subject, String content) {
        if (toEmail != null && !toEmail.isEmpty()) {
            sendEmail(toEmail, subject, content);
        }
        if (toPhone != null && !toPhone.isEmpty()) {
            sendSms(toPhone, content);
        }
    }
}
