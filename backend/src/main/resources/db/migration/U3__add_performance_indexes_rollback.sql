-- =====================================================
-- V3 Rollback: Remove Performance Indexes
-- =====================================================
-- This rollback script removes all indexes added in V3 migration.
-- =====================================================

DROP INDEX IF EXISTS idx_users_role_created ON users;
DROP INDEX IF EXISTS idx_products_category_stock ON products;
DROP INDEX IF EXISTS idx_products_type_price ON products;
DROP INDEX IF EXISTS idx_orders_status_created ON orders;
DROP INDEX IF EXISTS idx_products_name_category ON products;
DROP INDEX IF EXISTS idx_products_price_category ON products;
DROP INDEX IF EXISTS idx_orders_user_status ON orders;