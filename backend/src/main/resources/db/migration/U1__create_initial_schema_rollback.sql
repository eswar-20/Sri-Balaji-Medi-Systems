-- =====================================================
-- V1 Rollback: Drop Initial Schema
-- =====================================================
-- This rollback script removes all tables created in V1 migration
-- in reverse order of creation to respect foreign key dependencies.
-- =====================================================

DROP TABLE IF EXISTS otps;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;