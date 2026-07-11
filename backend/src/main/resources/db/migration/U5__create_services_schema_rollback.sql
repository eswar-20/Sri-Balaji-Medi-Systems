DROP INDEX IF EXISTS idx_audit_log_request ON service_audit_logs;
DROP INDEX IF EXISTS idx_amc_user ON amc_contracts;
DROP INDEX IF EXISTS idx_service_visit_assignment ON service_visits;
DROP INDEX IF EXISTS idx_service_request_priority ON service_requests;
DROP INDEX IF EXISTS idx_service_request_status ON service_requests;
DROP INDEX IF EXISTS idx_service_request_user ON service_requests;

DROP TABLE IF EXISTS service_audit_logs;
DROP TABLE IF EXISTS service_invoices;
DROP TABLE IF EXISTS amc_contracts;
DROP TABLE IF EXISTS service_part_usages;
DROP TABLE IF EXISTS service_visits;
DROP TABLE IF EXISTS service_assignments;
DROP TABLE IF EXISTS service_requests;
DROP TABLE IF EXISTS service_engineers;
