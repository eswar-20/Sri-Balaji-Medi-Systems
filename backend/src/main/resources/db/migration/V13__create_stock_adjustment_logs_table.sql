CREATE TABLE stock_adjustment_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    adjustment_type VARCHAR(50) NOT NULL,
    quantity_changed INT NOT NULL,
    reason VARCHAR(255),
    performed_by VARCHAR(255) NOT NULL,
    timestamp DATETIME NOT NULL
);
