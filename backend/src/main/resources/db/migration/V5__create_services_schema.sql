-- Create Service Engineers (Technicians profile mapping to users table)
CREATE TABLE service_engineers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    profile_photo_url VARCHAR(500),
    skills VARCHAR(1000),
    certifications VARCHAR(1000),
    experience_years INT DEFAULT 0,
    current_latitude DOUBLE,
    current_longitude DOUBLE,
    availability VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    rating DOUBLE DEFAULT 5.0,
    active_status BOOLEAN DEFAULT TRUE,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_engineer_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uq_engineer_user UNIQUE (user_id),
    CONSTRAINT uq_engineer_employee UNIQUE (employee_id),
    CONSTRAINT uq_engineer_email UNIQUE (email),
    CONSTRAINT uq_engineer_phone UNIQUE (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Service Requests table
CREATE TABLE service_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NULL,
    equipment_name VARCHAR(200) NOT NULL,
    equipment_brand VARCHAR(100) NOT NULL,
    equipment_model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    clinic_hospital_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(200) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(500) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    description VARCHAR(2000) NOT NULL,
    scheduled_date DATETIME NOT NULL,
    preferred_visit_time VARCHAR(100) NOT NULL,
    estimated_duration_hours INT DEFAULT 2,
    purchase_date DATE,
    warranty_expiry DATE,
    customer_remarks VARCHAR(1000),
    internal_owner_notes VARCHAR(1000),
    created_at DATETIME,
    updated_at DATETIME,
    version BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT fk_request_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_request_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Service Assignments table
CREATE TABLE service_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_request_id BIGINT NOT NULL,
    engineer_id BIGINT NOT NULL,
    assigned_at DATETIME NOT NULL,
    notes VARCHAR(1000),
    CONSTRAINT fk_assignment_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_assignment_engineer FOREIGN KEY (engineer_id) REFERENCES service_engineers(id),
    CONSTRAINT uq_assignment_request UNIQUE (service_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Service Visits table (Supporting multiple visits per request)
CREATE TABLE service_visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    assignment_id BIGINT NOT NULL,
    visit_number INT NOT NULL,
    purpose VARCHAR(500) NOT NULL,
    visit_date DATETIME NOT NULL,
    notes VARCHAR(2000) NOT NULL,
    before_photo_url VARCHAR(500),
    after_photo_url VARCHAR(500),
    engineer_report_url VARCHAR(500),
    customer_signature_url VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    CONSTRAINT fk_visit_assignment FOREIGN KEY (assignment_id) REFERENCES service_assignments(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Service Part Usages table (Linking visits with spare parts inventory)
CREATE TABLE service_part_usages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visit_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_usage_visit FOREIGN KEY (visit_id) REFERENCES service_visits(id) ON DELETE CASCADE,
    CONSTRAINT fk_usage_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create AMC Contracts table
CREATE TABLE amc_contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    equipment_name VARCHAR(200) NOT NULL,
    equipment_brand VARCHAR(100) NOT NULL,
    equipment_model VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    contract_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    visits_per_year INT DEFAULT 4,
    remaining_visits INT DEFAULT 4,
    CONSTRAINT fk_amc_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Service Invoices table
CREATE TABLE service_invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_request_id BIGINT NOT NULL,
    parts_cost DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    labor_cost DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    invoice_status VARCHAR(50) NOT NULL DEFAULT 'UNPAID',
    invoice_pdf_url VARCHAR(500),
    CONSTRAINT fk_invoice_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE,
    CONSTRAINT uq_invoice_request UNIQUE (service_request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Service Audit Logs table
CREATE TABLE service_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    service_request_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL,
    notes VARCHAR(1000),
    performed_by VARCHAR(100) NOT NULL,
    timestamp DATETIME NOT NULL,
    CONSTRAINT fk_log_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Performance Indexes for Services Module
CREATE INDEX idx_service_request_user ON service_requests(user_id);
CREATE INDEX idx_service_request_status ON service_requests(status);
CREATE INDEX idx_service_request_priority ON service_requests(priority);
CREATE INDEX idx_service_visit_assignment ON service_visits(assignment_id);
CREATE INDEX idx_amc_user ON amc_contracts(user_id);
CREATE INDEX idx_audit_log_request ON service_audit_logs(service_request_id);
