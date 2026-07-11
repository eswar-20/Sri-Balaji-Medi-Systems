-- =====================================================
-- V3: Add Performance Indexes
-- =====================================================
-- This migration adds additional performance-critical indexes
-- for optimized query performance.
-- =====================================================

-- User performance indexes
CREATE INDEX idx_users_role_created ON users(role, created_at);

-- Product performance indexes
CREATE INDEX idx_products_category_stock ON products(category_id, stock);
CREATE INDEX idx_products_type_price ON products(product_type, price);

-- Order performance indexes
CREATE INDEX idx_orders_status_created ON orders(status, created_at);

-- Additional composite indexes for common query patterns
CREATE INDEX idx_products_name_category ON products(name, category_id);
CREATE INDEX idx_products_price_category ON products(price, category_id);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);