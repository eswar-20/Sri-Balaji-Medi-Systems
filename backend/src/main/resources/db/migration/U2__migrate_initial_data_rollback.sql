-- =====================================================
-- V2 Rollback: Remove Initial Data
-- =====================================================
-- This rollback script removes all initial data inserted in V2 migration.
-- =====================================================

-- Delete all products
DELETE FROM products;

-- Delete all categories
DELETE FROM categories;