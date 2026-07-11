package com.mediequip.marketplace.service;

import com.mediequip.marketplace.entity.Otp;
import com.mediequip.marketplace.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final OtpRepository otpRepository;

    @org.springframework.beans.factory.annotation.Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    private String hashOtp(String otpCode) {
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otpCode.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error hashing OTP: " + e.getMessage());
        }
    }

    public String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    @Transactional
    public void sendOtp(String identifier, String password) {
        if ("sribalajimedisystemsofficial@gmail.com".equalsIgnoreCase(identifier)) {
            String adminPasswordEnv = System.getenv("ADMIN_PASSWORD");
            if (adminPasswordEnv == null || adminPasswordEnv.trim().isEmpty()) {
                log.warn("ADMIN_PASSWORD environment variable not set. Falling back to default 'SBMS@2026'.");
                adminPasswordEnv = "SBMS@2026";
            }
            if (password == null || !password.equals(adminPasswordEnv)) {
                throw new RuntimeException("Authentication failed: Invalid password for administrator account.");
            }
        }

        LocalDateTime now = LocalDateTime.now();

        // 1. Check if there is an active lockout on the identifier
        otpRepository.findFirstByIdentifierOrderByCreatedAtDesc(identifier)
                .ifPresent(lastOtp -> {
                    if (lastOtp.getLockedUntil() != null && now.isBefore(lastOtp.getLockedUntil())) {
                        long secondsLeft = java.time.Duration.between(now, lastOtp.getLockedUntil()).toSeconds();
                        long minutesLeft = (secondsLeft / 60) + 1;
                        throw new RuntimeException("Too many verification attempts. Lockout active. Try again in " + minutesLeft + " minutes.");
                    }
                });

        // Mark previous OTPs as used
        otpRepository.findByIdentifierAndIsUsedFalse(identifier)
                .ifPresent(otp -> {
                    otp.setIsUsed(true);
                    otpRepository.save(otp);
                });

        // Generate new 6-digit OTP
        String otpCode = generateOtp();
        String hashedOtp = hashOtp(otpCode);
        LocalDateTime expiryTime = now.plusMinutes(5);

        Otp otp = Otp.builder()
                .identifier(identifier)
                .otp(hashedOtp)
                .expiryTime(expiryTime)
                .attempts(0)
                .build();

        otpRepository.save(otp);

        // Send OTP via email or phone
        if (isEmail(identifier)) {
            sendEmailOtp(identifier, otpCode);
        } else {
            sendPhoneOtp(identifier, otpCode);
        }

        log.info("OTP sent successfully to identifier.");
    }

    private boolean isEmail(String identifier) {
        return identifier.contains("@");
    }

    private void sendEmailOtp(String email, String otpCode) {
        String apiKey = brevoApiKey;
        if (apiKey == null || apiKey.trim().isEmpty()) {
            apiKey = System.getenv("BREVO_API_KEY");
        }
        
        if (apiKey == null || apiKey.trim().isEmpty()) {
            throw new RuntimeException("Brevo API key is not configured. Please define BREVO_API_KEY environment variable on your server.");
        }

        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            
            String jsonPayload = "{"
                    + "\"sender\":{"
                    + "\"name\":\"Sri Balaji Medi Systems\","
                    + "\"email\":\"sribalajimedisystemsofficial@gmail.com\""
                    + "},"
                    + "\"to\":[{"
                    + "\"email\":\"" + email + "\""
                    + "}],"
                    + "\"subject\":\"Sri Balaji Medical Systems - OTP Verification\","
                    + "\"textContent\":\"Sri Balaji Medical Systems\\n\\nYour verification code is\\n\\n" + otpCode + "\\n\\nValid for 5 minutes.\\n\\nDo not share this code.\""
                    + "}";

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", apiKey.trim())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("Email OTP successfully sent to {} via Brevo API.", email);
            } else {
                log.error("Failed to send email via Brevo API. HTTP Status: {}, Response: {}", response.statusCode(), response.body());
                throw new RuntimeException("Brevo API returned status code: " + response.statusCode() + " - " + response.body());
            }
        } catch (Exception e) {
            log.error("Failed to send email OTP to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("OTP Email delivery failed: " + e.getMessage() + " (For testing, copy this OTP code: " + otpCode + ")", e);
        }
    }

    private void sendPhoneOtp(String phone, String otpCode) {
        String provider = System.getenv("SMS_PROVIDER");
        String apiKey = System.getenv("SMS_API_KEY");
        String senderId = System.getenv("SMS_SENDER_ID");
        
        String messageText = "Sri Balaji Medical Systems\nYour verification code is\n" + otpCode + "\nValid for 5 minutes.\nDo not share this code.";

        if (provider != null && !provider.trim().isEmpty() && apiKey != null && !apiKey.trim().isEmpty()) {
            log.info("Sending SMS via provider {}: To: {}, Sender: {}", provider, phone, senderId);
            try {
                java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
                java.net.http.HttpRequest request = null;
                
                if ("twilio".equalsIgnoreCase(provider)) {
                    String url = "https://api.twilio.com/2010-04-01/Accounts/" + apiKey + "/Messages.json";
                    request = java.net.http.HttpRequest.newBuilder()
                            .uri(java.net.URI.create(url))
                            .header("Content-Type", "application/x-www-form-urlencoded")
                            .POST(java.net.http.HttpRequest.BodyPublishers.ofString("To=" + phone + "&From=" + senderId + "&Body=" + java.net.URLEncoder.encode(messageText, "UTF-8")))
                            .build();
                } else if ("msg91".equalsIgnoreCase(provider)) {
                    String url = "https://api.msg91.com/api/v5/otp?template_id=" + senderId + "&mobile=" + phone + "&authkey=" + apiKey + "&otp=" + otpCode;
                    request = java.net.http.HttpRequest.newBuilder()
                            .uri(java.net.URI.create(url))
                            .header("Content-Type", "application/json")
                            .POST(java.net.http.HttpRequest.BodyPublishers.ofString("{}"))
                            .build();
                } else if ("fast2sms".equalsIgnoreCase(provider)) {
                    String url = "https://www.fast2sms.com/dev/bulkV2?authorization=" + apiKey + "&route=q&message=" + java.net.URLEncoder.encode(messageText, "UTF-8") + "&flash=0&numbers=" + phone;
                    request = java.net.http.HttpRequest.newBuilder()
                            .uri(java.net.URI.create(url))
                            .GET()
                            .build();
                }
                
                if (request != null) {
                    java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());
                    log.info("SMS Provider response status: {}", response.statusCode());
                }
            } catch (Exception e) {
                log.error("Failed to send SMS through provider {}: {}", provider, e.getMessage());
            }
        } else {
            log.info("SMS Provider not configured. PHONE OTP - To: {}, OTP: {}", phone, otpCode);
        }
    }

    @Transactional
    public boolean verifyOtp(String identifier, String otpCode) {
        LocalDateTime now = LocalDateTime.now();
        
        // 1. Fetch valid (unused and non-expired) OTP record
        Optional<Otp> otpOpt = otpRepository.findValidOtpByIdentifier(identifier, now);
        if (otpOpt.isEmpty()) {
            return false;
        }

        Otp otp = otpOpt.get();

        // 2. Check if active lockout exists
        if (otp.getLockedUntil() != null && now.isBefore(otp.getLockedUntil())) {
            long secondsLeft = java.time.Duration.between(now, otp.getLockedUntil()).toSeconds();
            long minutesLeft = (secondsLeft / 60) + 1;
            throw new RuntimeException("Too many verification attempts. Lockout active. Try again in " + minutesLeft + " minutes.");
        }

        String hashedInput = hashOtp(otpCode);
        if (otp.getOtp().equals(hashedInput)) {
            // Delete OTP immediately after successful verification
            otpRepository.delete(otp);
            return true;
        } else {
            // Increment attempt count on failure
            int currentAttempts = otp.getAttempts() == null ? 0 : otp.getAttempts();
            currentAttempts++;
            otp.setAttempts(currentAttempts);

            if (currentAttempts >= 5) {
                otp.setLockedUntil(now.plusMinutes(15));
                otpRepository.save(otp);
                throw new RuntimeException("Maximum verification attempts exceeded. Locked out for 15 minutes.");
            }

            otpRepository.save(otp);
            return false;
        }
    }

    public void cleanupExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        otpRepository.deleteAllByExpiryTimeBefore(now);
        log.info("Cleaned up expired OTPs");
    }
}
