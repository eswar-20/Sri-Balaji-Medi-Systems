CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    action_name VARCHAR(255) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    ip_address VARCHAR(50),
    browser VARCHAR(255),
    timestamp DATETIME NOT NULL
);
