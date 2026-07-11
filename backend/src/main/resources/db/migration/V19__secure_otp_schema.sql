-- V19: Alter otps table to support hashed OTP codes (SHA-256) and attempt lockouts
ALTER TABLE otps 
  MODIFY COLUMN otp VARCHAR(64) NOT NULL,
  ADD COLUMN attempts INT DEFAULT 0,
  ADD COLUMN locked_until DATETIME NULL;
