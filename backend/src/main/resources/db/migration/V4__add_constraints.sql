-- =====================================================
-- V4: Add Data Integrity Constraints
-- =====================================================
-- This migration adds additional data integrity constraints
-- for enhanced data validation and consistency.
-- =====================================================

-- Add stock validation constraint
ALTER TABLE products ADD CONSTRAINT chk_products_stock_non_negative 
CHECK (stock >= 0);

-- Add price validation constraint
ALTER TABLE products ADD CONSTRAINT chk_products_price_positive 
CHECK (price > 0);

-- Add order quantity validation constraint
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_quantity_positive 
CHECK (quantity > 0);

-- Add order item price validation constraint
ALTER TABLE order_items ADD CONSTRAINT chk_order_items_price_positive 
CHECK (price > 0);

-- Add cart quantity validation constraint
ALTER TABLE cart_items ADD CONSTRAINT chk_cart_items_quantity_positive 
CHECK (quantity > 0);

-- Add phone number format constraint
ALTER TABLE users ADD CONSTRAINT chk_users_phone_format 
CHECK (phone REGEXP '^[0-9]{10}$');

-- Add pincode format constraint
ALTER TABLE orders ADD CONSTRAINT chk_orders_pincode_format 
CHECK (pincode REGEXP '^[0-9]{5,6}$');