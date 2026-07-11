-- =====================================================
-- V4 Rollback: Remove Data Integrity Constraints
-- =====================================================
-- This rollback script removes all constraints added in V4 migration.
-- =====================================================

ALTER TABLE products DROP CONSTRAINT IF EXISTS chk_products_stock_non_negative;
ALTER TABLE products DROP CONSTRAINT IF EXISTS chk_products_price_positive;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS chk_order_items_quantity_positive;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS chk_order_items_price_positive;
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS chk_cart_items_quantity_positive;
ALTER TABLE users DROP CONSTRAINT IF EXISTS chk_users_phone_format;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS chk_orders_pincode_format;