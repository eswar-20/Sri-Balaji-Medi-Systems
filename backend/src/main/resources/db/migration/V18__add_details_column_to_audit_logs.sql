-- =====================================================
-- V18: Add details column to audit_logs table
-- =====================================================

ALTER TABLE audit_logs ADD COLUMN details VARCHAR(1000) AFTER performed_by;
