-- =====================================================
-- V2: Migrate Initial Data
-- =====================================================
-- This migration handles the initial data seeding including categories
-- and products with proper category_id references.
-- =====================================================

-- Insert Categories with proper product types
INSERT INTO categories (name, description, product_type) VALUES
('ECG Machines', 'Electrocardiogram machines for cardiac monitoring', 'EQUIPMENT'),
('ECG Cables', 'ECG connecting cables and accessories', 'SPARE_PART'),
('SPO2 Probes', 'Pulse oximeter probes and sensors', 'SPARE_PART'),
('NIBP Cuffs', 'Non-invasive blood pressure cuffs', 'SPARE_PART'),
('Pulse Oximeters', 'Portable pulse oximeter devices', 'EQUIPMENT'),
('Monitors', 'Patient monitoring systems', 'EQUIPMENT'),
('Oxygen Concentrators', 'Oxygen concentration equipment', 'EQUIPMENT'),
('Infusion & Syringe Pumps', 'Medical infusion pumps', 'EQUIPMENT'),
('Spiro Meter', 'Spirometry testing devices', 'EQUIPMENT'),
('TMT Machines', 'Treadmill test machines', 'EQUIPMENT'),
('Defibrillators', 'Cardiac defibrillation devices', 'EQUIPMENT'),
('Boyles Machines', 'Infant warming equipment', 'EQUIPMENT'),
('Cautery Machines', 'Electrosurgical units', 'EQUIPMENT'),
('Suction Machines', 'Medical suction devices', 'EQUIPMENT'),
('Fetal Doppler', 'Fetal heart monitoring devices', 'EQUIPMENT'),
('CTG Machines', 'Cardiotocography machines', 'EQUIPMENT'),
('Warmer & Photo Therapy', 'Infant warming and phototherapy', 'EQUIPMENT'),
('OT Tables', 'Operating room tables', 'EQUIPMENT'),
('OT Lights', 'Operating room lights', 'EQUIPMENT'),
('Vein Finder', 'Vein visualization devices', 'EQUIPMENT'),
('Eye Masks', 'Medical protective eye masks', 'SPARE_PART'),
('ID Tags', 'Hospital identification tags', 'SPARE_PART'),
('Batteries', 'Medical equipment batteries', 'SPARE_PART'),
('ECG Bulb & Clamp Sets', 'ECG electrode sets', 'SPARE_PART'),
('ECG Paper Rolls', 'Thermal paper for ECG machines', 'SPARE_PART'),
('Doppler & CTG Machines', 'Combined doppler CTG systems', 'EQUIPMENT'),
('ECG, CTG & Scan Papers', 'Medical recording papers', 'SPARE_PART'),
('Spare Parts', 'Spare parts and accessories for medical equipment', 'SPARE_PART');

-- Insert Products with proper category_id references
INSERT INTO products (id, name, category_id, price, description, image_url, stock, product_type, specifications, features) VALUES
(1, 'ECG Machine', (SELECT id FROM categories WHERE name = 'ECG Machines'), 45000.00, '12-channel interpretation ECG machine with built-in thermal printer and large LCD display', '/images/all-products/ECG Machine.jpg', 5, 'EQUIPMENT',
'{"Channels": "12", "Display": "7-inch LCD", "Printer": "Built-in thermal", "Battery": "Rechargeable", "Dimensions": "320x240x100mm", "Weight": "2.5kg"}',
'["12-channel acquisition", "Automatic interpretation", "Built-in thermal printer", "Large LCD display", "Portable design"]'),

(2, 'ECG Cable', (SELECT id FROM categories WHERE name = 'ECG Cables'), 2500.00, '3-lead ECG cable with universal compatibility', '/images/all-products/ecg-cable.jpg', 10, 'SPARE_PART',
'{"Type": "3-lead ECG cable", "Length": "1.5 meters", "Connector": "Pin-type", "Compatibility": "All ECG machines"}',
'["High-quality copper", "Durable insulation", "Universal compatibility"]'),

(3, 'SPO2 Probe', (SELECT id FROM categories WHERE name = 'SPO2 Probes'), 1500.00, 'Finger pulse oximeter probe with high accuracy', '/images/all-products/spo2.jpg', 15, 'SPARE_PART',
'{"Type": "Finger pulse oximeter probe", "Accuracy": "±2%", "Display": "LED", "Battery Life": "30 hours"}',
'["Real-time SpO2 monitoring", "Pulse rate display", "Low battery indicator"]'),

(4, 'NIBP Cuff', (SELECT id FROM categories WHERE name = 'NIBP Cuffs'), 1200.00, 'Adult size NIBP cuff with adjustable fit', '/images/all-products/nibp.jpg', 20, 'SPARE_PART',
'{"Size": "Adult", "Range": "0-300 mmHg", "Material": "Nylon", "Compatibility": "All NIBP monitors"}',
'["Adjustable cuff size", "Durable material", "Easy to clean"]'),

(5, 'Pulse Oximeter', (SELECT id FROM categories WHERE name = 'Pulse Oximeters'), 3000.00, 'Portable pulse oximeter with LED display', '/images/all-products/oximeter.jpg', 12, 'EQUIPMENT',
'{"Display": "LED", "SpO2 Range": "70-100%", "PR Range": "25-250 bpm", "Battery": "AAA alkaline"}',
'["One-button operation", "Bright LED display", "Low battery indicator"]'),

(6, 'Patient Monitor', (SELECT id FROM categories WHERE name = 'Monitors'), 65000.00, 'Multi-parameter patient monitor with comprehensive monitoring', '/images/all-products/monitor.jpg', 8, 'EQUIPMENT',
'{"Display": "12-inch LCD", "Parameters": "ECG, SpO2, NIBP, Temp", "Battery": "4 hours backup", "Weight": "2.8kg", "Dimensions": "210x150x80mm"}',
'["Multi-parameter monitoring", "Touch screen interface", "Trend graph display", "Alarm system", "Network connectivity"]'),

(7, 'Oxygen Concentrator', (SELECT id FROM categories WHERE name = 'Oxygen Concentrators'), 75000.00, 'High-flow oxygen concentrator with precise delivery', '/images/all-products/oxygen.jpg', 6, 'EQUIPMENT',
'{"Flow Range": "0.1-15 L/min", "Oxygen Concentration": "93% ±3%", "Power": "220V AC", "Dimensions": "380x380x610mm", "Weight": "19kg"}',
'["Precise flow control", "Oxygen purity monitoring", "Portable design", "Low maintenance"]'),

(8, 'Infusion Pump', (SELECT id FROM categories WHERE name = 'Infusion & Syringe Pumps'), 25000.00, 'Precision infusion pump with LCD display', '/images/all-products/pump.jpg', 10, 'EQUIPMENT',
'{"Flow Rate": "0.1-999 ml/hr", "Pressure Range": "0-300 mmHg", "Display": "LCD", "Battery": "8 hours", "Weight": "1.5kg"}',
'["Precise flow control", "Pressure monitoring", "Portable design", "Easy to operate"]'),

(9, 'Spirometer', (SELECT id FROM categories WHERE name = 'Spiro Meter'), 20000.00, 'Handheld spirometer with high accuracy', '/images/all-products/spiro.jpg', 15, 'EQUIPMENT',
'{"Range": "1000-9000 ml", "Accuracy": "±3%", "Display": "Analog", "Material": "Plastic", "Weight": "150g"}',
'["High accuracy", "Durable construction", "Easy to read", "Pocket size"]'),

(10, 'TMT Machine', (SELECT id FROM categories WHERE name = 'TMT Machines'), 120000.00, 'Multi-parameter treadmill test machine', '/images/all-products/tmt.jpg', 4, 'EQUIPMENT',
'{"Type": "Multi-parameter TMT", "Display": "15-inch LCD", "Parameters": "ECG, NIBP, SpO2, Temp, Resp", "Battery": "6 hours", "Weight": "3.2kg"}',
'["Comprehensive monitoring", "Touch screen interface", "Data storage", "Portable design"]'),

(11, 'Defibrillator', (SELECT id FROM categories WHERE name = 'Defibrillators'), 90000.00, 'Professional defibrillator with biphasic capability', '/images/all-products/defib.jpg', 3, 'EQUIPMENT',
'{"Energy": "200J", "Mode": "Manual/Auto", "Display": "LCD", "Battery": "Rechargeable", "Weight": "2.5kg"}',
'["Biphasic capability", "CPR guidance", "Shock advisory", "Data recording"]'),

(12, 'Boyles Machine', (SELECT id FROM categories WHERE name = 'Boyles Machines'), 110000.00, 'Infant warmer with precise temperature control', '/images/all-products/boyle.jpg', 5, 'EQUIPMENT',
'{"Type": "Infant Warmer", "Temperature Range": "34-39°C", "Heating Time": "5 minutes", "Display": "Digital", "Power": "220V AC", "Weight": "1.8kg"}',
'["Precise temperature control", "Fast heating", "Safety alarms", "Portable design"]'),

(13, 'Cautery Machine', (SELECT id FROM categories WHERE name = 'Cautery Machines'), 35000.00, 'Electrosurgical unit with multiple modes', '/images/all-products/cautery.jpg', 7, 'EQUIPMENT',
'{"Type": "Electrocautery", "Power Modes": "Cut/Coag", "Power Settings": "10-50W", "Display": "LED", "Weight": "1.2kg"}',
'["Multiple power modes", "Precise control", "Safety features", "Portable design"]'),

(14, 'Suction Machine', (SELECT id FROM categories WHERE name = 'Suction Machines'), 15000.00, 'Medical suction machine with quiet operation', '/images/all-products/suction.jpg', 8, 'EQUIPMENT',
'{"Suction Power": "800W", "Vacuum Range": "0-700 mmHg", "Canister Size": "1000ml", "Noise Level": "< 60 dB", "Weight": "3.5kg"}',
'["High suction power", "Quiet operation", "Portable design", "Easy to clean"]'),

(15, 'Fetal Doppler', (SELECT id FROM categories WHERE name = 'Fetal Doppler'), 8000.00, 'Portable fetal heart monitoring device', '/images/all-products/doppler.jpg', 12, 'EQUIPMENT',
'{"Frequency": "2-3 MHz", "Display": "LCD", "Battery": "AA", "Probe Options": "2/3/4 MHz", "Weight": "200g"}',
'["Clear fetal heart sounds", "Digital display", "Portable design", "Long battery life"]'),

(16, 'CTG Machine', (SELECT id FROM categories WHERE name = 'CTG Machines'), 95000.00, 'Fetal monitoring system with twins capability', '/images/all-products/ctg.jpg', 6, 'EQUIPMENT',
'{"Monitoring": "FHR, UC, MHR", "Twins Capability": "Yes", "Display": "12-inch LCD", "Printer": "Built-in thermal", "Battery": "4 hours backup", "Weight": "2.8kg"}',
'["Twins monitoring", "Real-time printing", "Data storage", "Network connectivity"]'),

(17, 'Baby Warmer', (SELECT id FROM categories WHERE name = 'Warmer & Photo Therapy'), 70000.00, 'Infant radiant warmer with safety features', '/images/all-products/warmer.jpg', 9, 'EQUIPMENT',
'{"Type": "Infant Radiant Warmer", "Temperature Range": "32-38°C", "Heating Time": "3 minutes", "Display": "Digital", "Weight": "1.5kg", "Safety Features": "Overheat protection"}',
'["Fast heating", "Temperature control", "Safety alarms", "Portable design"]'),

(18, 'OT Table', (SELECT id FROM categories WHERE name = 'OT Tables'), 150000.00, 'Operating table with height adjustment', '/images/all-products/ot-table.jpg', 3, 'EQUIPMENT',
'{"Type": "Operating Table", "Dimensions": "2000x600x800mm", "Height Adjustment": "650-950mm", "Weight Capacity": "150kg", "Material": "Stainless steel"}',
'["Height adjustable", "Trendelenburg position", "Easy to clean", "Durable construction"]'),

(19, 'OT Light', (SELECT id FROM categories WHERE name = 'OT Lights'), 140000.00, 'LED surgical light with shadow-free illumination', '/images/all-products/ot-light.jpg', 4, 'EQUIPMENT',
'{"Type": "LED Surgical Light", "Light Intensity": "100,000 lux", "Color Temperature": "3500-6500K", "Battery Life": "4 hours", "Weight": "1.2kg"}',
'["Shadow-free illumination", "Adjustable intensity", "Long battery life", "Portable design"]'),

(20, 'Vein Finder', (SELECT id FROM categories WHERE name = 'Vein Finder'), 30000.00, 'LED vein finder for easy visualization', '/images/all-products/vein.jpg', 10, 'EQUIPMENT',
'{"Type": "LED Vein Finder", "Light Intensity": "High brightness LED", "Detection Range": "10-15mm depth", "Battery": "Rechargeable", "Weight": "300g"}',
'["Clear vein visualization", "Adjustable brightness", "Portable design", "Long battery life"]'),

(21, 'Eye Mask', (SELECT id FROM categories WHERE name = 'Eye Masks'), 200.00, 'Medical protective eye mask', '/images/all-products/eye.jpg', 50, 'SPARE_PART',
'{"Type": "Medical Eye Mask", "Material": "Non-woven fabric", "Filtration": "3-ply", "Size": "Standard adult", "Packaging": "Individual"}',
'["High filtration efficiency", "Comfortable fit", "Breathable material", "Disposable"]'),

(22, 'ID Tag', (SELECT id FROM categories WHERE name = 'ID Tags'), 50.00, 'Hospital identification tag with LCD display', '/images/all-products/tag.jpg', 25, 'SPARE_PART',
'{"Type": "Hospital ID Tag", "Display": "LCD", "Memory": "1000 records", "Battery": "Rechargeable", "Weight": "50g"}',
'["Clear display", "Barcode scanner", "Durable construction", "Easy to program"]'),

(23, 'Battery', (SELECT id FROM categories WHERE name = 'Batteries'), 500.00, 'Medical equipment battery with long life', '/images/all-products/battery.jpg', 30, 'SPARE_PART',
'{"Type": "Medical Equipment Battery", "Voltage": "12V", "Capacity": "2000mAh", "Chemistry": "Lithium-ion", "Weight": "150g"}',
'["Long battery life", "Fast charging", "Lightweight design", "Reliable performance"]'),

(24, 'ECG Clamp Set', (SELECT id FROM categories WHERE name = 'ECG Bulb & Clamp Sets'), 1200.00, 'ECG electrode set with universal compatibility', '/images/all-products/clamp.jpg', 15, 'SPARE_PART',
'{"Type": "ECG Electrode Set", "Material": "Stainless steel", "Clamp Type": "Universal", "Cable Length": "1 meter", "Quantity": "10 pieces"}',
'["High conductivity", "Durable construction", "Universal compatibility", "Easy to use"]'),

(25, 'ECG Paper Roll', (SELECT id FROM categories WHERE name = 'ECG Paper Rolls'), 300.00, 'Thermal paper for ECG recording', '/images/all-products/paper.jpg', 40, 'SPARE_PART',
'{"Type": "ECG Thermal Paper", "Width": "110mm", "Length": "30 meters", "Gram Weight": "50g/m²", "Compatibility": "All thermal printers"}',
'["High quality print", "Long roll length", "Clear recording", "Universal compatibility"]'),

(26, 'Doppler CTG Combo', (SELECT id FROM categories WHERE name = 'Doppler & CTG Machines'), 100000.00, 'Combined doppler CTG monitoring system', '/images/all-products/doppler-ctg.jpg', 5, 'EQUIPMENT',
'{"Type": "Combined Doppler CTG", "Display": "7-inch LCD", "Parameters": "FHR, UC, MHR", "Battery": "6 hours", "Weight": "1.8kg"}',
'["Dual functionality", "Portable design", "Long battery life", "Clear display"]'),

(27, 'Scan Paper', (SELECT id FROM categories WHERE name = 'ECG, CTG & Scan Papers'), 400.00, 'Medical scan paper for universal compatibility', '/images/all-products/scan.jpg', 60, 'SPARE_PART',
'{"Type": "Medical Scan Paper", "Size": "A4", "Gram Weight": "70g/m²", "Quantity": "100 sheets", "Compatibility": "All medical scanners"}',
'["High quality print", "Bright white surface", "Universal compatibility", "Economical packaging"]');