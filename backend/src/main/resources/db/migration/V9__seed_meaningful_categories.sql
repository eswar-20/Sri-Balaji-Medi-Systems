-- =====================================================
-- V9: Seed Meaningful Categories & Re-associate Products (Idempotent)
-- =====================================================

-- 1. Insert or update the new meaningful categories
INSERT INTO categories (name, description, product_type) VALUES
('Diagnostic Equipment', 'Medical devices for diagnosing conditions', 'EQUIPMENT'),
('Imaging Equipment', 'Diagnostic imaging machines (MRI, X-Ray, CT, Ultrasound)', 'EQUIPMENT'),
('Critical Care & Ventilation', 'ICU ventilators, anesthesia workstations, oxygen systems', 'EQUIPMENT'),
('Patient Monitoring', 'Bedside monitors and fetal heart diagnostic devices', 'EQUIPMENT'),
('Infusion & Syringe Pumps', 'Precision volumetric and syringe infusion devices', 'EQUIPMENT'),
('Surgical & OT Equipment', 'Operating room tables, surgical lights, autoclaves, suction', 'EQUIPMENT'),
('Hospital Furniture', 'Adjustable ICU beds, dental chairs, patient furniture', 'EQUIPMENT'),
('Renal Care', 'Hemodialysis and renal support equipment', 'EQUIPMENT'),
('Medical Consumables', 'Disposable consumables for diagnostic equipment', 'EQUIPMENT'),

('ECG Parts & Accessories', 'Replacement cables, leads, and snap electrodes', 'SPARE_PART'),
('X-Ray Parts & Accessories', 'Rotating anode X-Ray tubes, grids, and digital sensors', 'SPARE_PART'),
('Ultrasound Parts & Accessories', 'Replacement transducers and convex probes', 'SPARE_PART'),
('Ventilator Parts & Accessories', 'HEPA filters, Backup batteries, O2 sensors', 'SPARE_PART'),
('Monitor Parts & Accessories', 'Bedside monitor batteries, replacement LCDs, touch panels', 'SPARE_PART'),
('Electronic & Power Components', 'SMPS boards, main logic motherboards, transformers, cooling fans', 'SPARE_PART'),
('Surgical Parts & Accessories', 'IPX8 foot pedals, handle assemblies, mount brackets', 'SPARE_PART'),
('Mechanical Components', 'Caster caster wheels, plastic housings, screws', 'SPARE_PART')
ON DUPLICATE KEY UPDATE description = VALUES(description), product_type = VALUES(product_type);

-- 2. Update products to map to the new categories
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Diagnostic Equipment') WHERE id = 1;
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Imaging Equipment') WHERE id IN (2, 3, 4, 10);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Critical Care & Ventilation') WHERE id IN (5, 6, 11, 19);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Patient Monitoring') WHERE id IN (7);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Infusion & Syringe Pumps') WHERE id IN (8, 9);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Hospital Furniture') WHERE id IN (12, 17);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Surgical & OT Equipment') WHERE id IN (13, 14, 16, 20);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Medical Consumables') WHERE id = 15;
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Renal Care') WHERE id = 18;

UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'ECG Parts & Accessories') WHERE id IN (21, 22);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'X-Ray Parts & Accessories') WHERE id IN (23, 24);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Ultrasound Parts & Accessories') WHERE id = 25;
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Ventilator Parts & Accessories') WHERE id IN (26, 27, 34);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Monitor Parts & Accessories') WHERE id IN (28, 29, 30, 43);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Electronic & Power Components') WHERE id IN (31, 32, 33, 35, 36, 37, 38, 39);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Surgical Parts & Accessories') WHERE id IN (40, 41);
UPDATE products SET category_id = (SELECT id FROM categories WHERE name = 'Mechanical Components') WHERE id IN (42, 44);
