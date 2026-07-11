-- =====================================================
-- V8: Seed Exact Products and Categories (Idempotent)
-- =====================================================

-- Insert or update categories
INSERT INTO categories (name, description, product_type) VALUES
('ECG Machines', 'ECG monitoring equipment', 'EQUIPMENT'),
('X-Ray Machines', 'Diagnostic X-Ray systems', 'EQUIPMENT'),
('MRI Scanners', 'Magnetic Resonance Imaging systems', 'EQUIPMENT'),
('CT Scanners', 'Computed Tomography systems', 'EQUIPMENT'),
('Ventilators', 'ICU ventilators and respirators', 'EQUIPMENT'),
('Defibrillators', 'Cardiac defibrillators', 'EQUIPMENT'),
('Patient Monitors', 'Multi-parameter patient monitors', 'EQUIPMENT'),
('Syringe Pumps', 'Precision syringe infusion pumps', 'EQUIPMENT'),
('Infusion Pumps', 'Volumetric infusion pumps', 'EQUIPMENT'),
('Ultrasound Machines', 'Diagnostic ultrasound systems', 'EQUIPMENT'),
('Oxygen Concentrators', 'Medical oxygen concentrators', 'EQUIPMENT'),
('Hospital Beds', 'ICU and ward beds', 'EQUIPMENT'),
('Operation Tables', 'Surgical operating tables', 'EQUIPMENT'),
('Autoclaves', 'Steam sterilization autoclaves', 'EQUIPMENT'),
('Surgical Lights', 'Operating theater lights', 'EQUIPMENT'),
('Dental Chairs', 'Dental operatory chairs', 'EQUIPMENT'),
('Dialysis Machines', 'Hemodialysis systems', 'EQUIPMENT'),
('Anesthesia Workstations', 'Integrated anesthesia systems', 'EQUIPMENT'),
('Suction Machines', 'Medical suction devices', 'EQUIPMENT'),
('ECG Electrodes Pack', 'Disposable ECG electrodes bulk packs', 'EQUIPMENT'),
('ECG Cables', 'ECG patient trunk cables and leadwires', 'SPARE_PART'),
('ECG Electrodes', 'Disposable ECG electrodes', 'SPARE_PART'),
('X-Ray Tubes', 'X-ray tube inserts and housings', 'SPARE_PART'),
('X-Ray Sensors', 'Digital radiography sensors', 'SPARE_PART'),
('Ultrasound Probes', 'Transducer probes for ultrasound', 'SPARE_PART'),
('Ventilator Filters', 'HME and bacterial filters', 'SPARE_PART'),
('Ventilator Batteries', 'Rechargeable backup batteries for ventilators', 'SPARE_PART'),
('Patient Monitor Batteries', 'Backup batteries for monitors', 'SPARE_PART'),
('LCD Displays', 'Replacement display screens', 'SPARE_PART'),
('Touch Screen Panels', 'Touch digitizers and panels', 'SPARE_PART'),
('Power Supply Boards', 'SMPS and power boards', 'SPARE_PART'),
('Motherboards', 'CPU and control motherboards', 'SPARE_PART'),
('Cooling Fans', 'DC cooling fans for equipment', 'SPARE_PART'),
('Oxygen Sensors', 'O2 cells and sensors', 'SPARE_PART'),
('Pressure Sensors', 'Air/fluid pressure transducers', 'SPARE_PART'),
('Valve Kits', 'Solenoid and control valves', 'SPARE_PART'),
('Fuse Kits', 'Safety fuses assortments', 'SPARE_PART'),
('Transformers', 'Isolation and power transformers', 'SPARE_PART'),
('Power Cables', 'Medical grade mains power cables', 'SPARE_PART'),
('Foot Switches', 'Surgical and control pedals', 'SPARE_PART'),
('Handle Assemblies', 'Equipment handles and mounts', 'SPARE_PART'),
('Wheel Kits', 'Caster wheels and brakes', 'SPARE_PART'),
('Plastic Covers', 'Chassis and housing panels', 'SPARE_PART'),
('Mounting Kits', 'Wall and roll stand mounts', 'SPARE_PART')
ON DUPLICATE KEY UPDATE description = VALUES(description), product_type = VALUES(product_type);

-- Insert or update products
INSERT INTO products (id, name, category_id, price, stock, description, image_url, product_type, specifications, features) VALUES
-- Medical Equipment (IDs 1-20)
(1, 'ECG Machine', (SELECT id FROM categories WHERE name = 'ECG Machines'), 45000.00, 10, '12-channel diagnostic ECG machine with built-in thermal printer and interpretation software.', '/images/all-products/ECG Machine.jpg', 'EQUIPMENT', 
'{"Channels": "12", "Display": "7-inch Color LCD", "Printer": "Thermal Paper", "Battery": "Rechargeable Li-ion"}', 
'["Auto-interpretation", "Built-in printer", "Battery backup", "Lightweight design"]'),

(2, 'X-Ray Machine', (SELECT id FROM categories WHERE name = 'X-Ray Machines'), 180000.00, 4, 'High-frequency mobile X-Ray machine for diagnostic imaging in clinics and hospitals.', '/images/all-products/xray.jpg', 'EQUIPMENT', 
'{"Power Output": "5 kW", "kVp Range": "40-110 kV", "mA Range": "10-100 mA", "Type": "Mobile HF"}', 
'["High frequency generator", "Digital control panel", "Compact mobility", "Low radiation leakage"]'),

(3, 'MRI Scanner', (SELECT id FROM categories WHERE name = 'MRI Scanners'), 4500000.00, 2, 'State-of-the-art 1.5T MRI scanner for high-resolution diagnostic imaging.', '/images/all-products/mri.jpg', 'EQUIPMENT', 
'{"Field Strength": "1.5 Tesla", "Bore Diameter": "60 cm", "Gradient Strength": "33 mT/m", "Helium Consumption": "Zero-boil-off"}', 
'["Superconductive magnet", "High SNR coils", "Zero-boil-off technology", "Advanced clinical packages"]'),

(4, 'CT Scanner', (SELECT id FROM categories WHERE name = 'CT Scanners'), 3500000.00, 3, 'High-speed 16-slice CT scanner for fast and accurate whole-body scanning.', '/images/all-products/ct.jpg', 'EQUIPMENT', 
'{"Slice Count": "16 Slices", "X-Ray Tube Capacity": "5.3 MHU", "Generator Power": "50 kW", "Rotation Speed": "0.5s"}', 
'["Low dose technology", "High throughput", "3D reconstruction", "Intuitive console workflow"]'),

(5, 'Ventilator', (SELECT id FROM categories WHERE name = 'Ventilators'), 120000.00, 8, 'Advanced ICU ventilator supporting both invasive and non-invasive ventilation modes.', '/images/all-products/ventilator.jpg', 'EQUIPMENT', 
'{"Modes": "VCV, PCV, SIMV, CPAP", "Display": "12.1-inch TFT Touchscreen", "Oxygen Sensor": "Paramagnetic", "Weight": "15 kg"}', 
'["Invasive & Non-invasive", "Smart ventilation modes", "Integrated O2 monitoring", "Backup battery"]'),

(6, 'Defibrillator', (SELECT id FROM categories WHERE name = 'Defibrillators'), 85000.00, 6, 'Biphasic defibrillator and monitor with manual/AED modes and integrated printer.', '/images/all-products/defib.jpg', 'EQUIPMENT', 
'{"Energy Range": "2-360 Joules", "Modes": "Manual, AED, Pacing", "Display": "6.5-inch Color TFT", "Charge Time": "< 5 seconds"}', 
'["Biphasic technology", "Pacing mode included", "Integrated thermal recorder", "SpO2 and NIBP options"]'),

(7, 'Patient Monitor', (SELECT id FROM categories WHERE name = 'Patient Monitors'), 65000.00, 15, 'Multi-parameter patient monitor tracking ECG, SpO2, NIBP, respiration, and temperature.', '/images/all-products/monitor.jpg', 'EQUIPMENT', 
'{"Parameters": "ECG, SpO2, NIBP, Resp, Temp", "Display": "12.1-inch LCD", "Battery Backup": "4 hours", "Trends": "168 hours"}', 
'["Audible & visual alarms", "Central station networkable", "Arrhythmia analysis", "Built-in rechargeable battery"]'),

(8, 'Syringe Pump', (SELECT id FROM categories WHERE name = 'Syringe Pumps'), 22000.00, 18, 'Precision syringe driver with occlusion alarms and drug library compatibility.', '/images/all-products/syringe-pump.jpg', 'EQUIPMENT', 
'{"Syringe Size Compatibility": "10ml, 20ml, 30ml, 50/60ml", "Flow Rate Range": "0.1-1500 ml/h", "Accuracy": "±2%", "Occlusion Limit": "Adjustable"}', 
'["Automatic syringe calibration", "Anti-bolus system", "Comprehensive alarm package", "Drug library pre-loaded"]'),

(9, 'Infusion Pump', (SELECT id FROM categories WHERE name = 'Infusion Pumps'), 25000.00, 20, 'Volumetric infusion pump for safe and accurate delivery of IV fluids and medications.', '/images/all-products/pump.jpg', 'EQUIPMENT', 
'{"Infusion Modes": "Rate, Time, Vol, Sequential", "Flow Rate Range": "0.1-1200 ml/h", "Drip Sensor": "Infrared", "Waterproof Rating": "IPX2"}', 
'["Double CPU design", "Bubble detection", "Adjustable pressure levels", "Warm-up function"]'),

(10, 'Ultrasound Machine', (SELECT id FROM categories WHERE name = 'Ultrasound Machines'), 250000.00, 5, 'Color Doppler diagnostic ultrasound system with multi-frequency probe support.', '/images/all-products/ultrasound.jpg', 'EQUIPMENT', 
'{"Imaging Modes": "B, M, Color, PW, Power", "Monitor": "15-inch LED", "Probe Connectors": "3 active ports", "Hard Drive": "500 GB"}', 
'["Color Doppler imaging", "3D/4D rendering option", "Digital beam former", "Multi-frequency probe support"]'),

(11, 'Oxygen Concentrator', (SELECT id FROM categories WHERE name = 'Oxygen Concentrators'), 55000.00, 12, 'High-capacity medical oxygen concentrator delivering up to 10 LPM pure oxygen.', '/images/all-products/oxygen.jpg', 'EQUIPMENT', 
'{"Flow Rate": "0.5-10 L/min", "O2 Concentration": "93% ±3%", "Outlet Pressure": "8.5 psi", "Power Consumption": "600W"}', 
'["Low O2 purity alarm", "Continuous flow delivery", "Dual flow option", "Quiet operation < 48 dBA"]'),

(12, 'Hospital Bed', (SELECT id FROM categories WHERE name = 'Hospital Beds'), 35000.00, 25, 'Five-function electric ICU hospital bed with adjustable height and cardiac chair position.', '/images/all-products/bed.jpg', 'EQUIPMENT', 
'{"Drive System": "Electric (4 Linak Motors)", "Load Capacity": "250 kg", "Positions": "Backrest, Kneerest, Height, Trendelenburg", "Material": "ABS & Steel"}', 
'["Linak motor system", "Cardiac chair position", "Central lock casters", "Battery backup"]'),

(13, 'Operation Table', (SELECT id FROM categories WHERE name = 'Operation Tables'), 150000.00, 5, 'Electro-hydraulic surgical operating table with C-arm compatibility and radiolucent top.', '/images/all-products/ot-table.jpg', 'EQUIPMENT', 
'{"Table Length": "2020 mm", "Table Width": "520 mm", "Height Range": "680-980 mm", "Trendelenburg Tilt": "±25°"}', 
'["Electro-hydraulic drive", "C-arm compatible", "Rechargeable backup battery", "Split leg section"]'),

(14, 'Autoclave', (SELECT id FROM categories WHERE name = 'Autoclaves'), 40000.00, 8, 'Tabletop Class B steam sterilizer autoclave with pre-vacuum and dry cycles.', '/images/all-products/autoclave.jpg', 'EQUIPMENT', 
'{"Chamber Volume": "23 Liters", "Sterilization Temp": "121°C and 134°C", "Vacuum Pump": "Built-in double stage", "Water Tank Capacity": "4 Liters"}', 
'["Class B pre-vacuum", "LCD cycle selection", "Thermal printer integrated", "Safety door interlock"]'),

(15, 'ECG Electrodes', (SELECT id FROM categories WHERE name = 'ECG Electrodes Pack'), 1500.00, 100, 'Bulk pack of 500 disposable solid-gel snap ECG electrodes for adults.', '/images/all-products/electrodes-pack.jpg', 'EQUIPMENT', 
'{"Quantity": "500 Electrodes/Pack", "Gel Type": "Solid conductive gel", "Backing": "Non-woven cloth", "Connector": "Standard Snap"}', 
'["Hypoallergenic gel", "Strong adhesion", "Bulk packaging", "Excellent conductivity"]'),

(16, 'Surgical Light', (SELECT id FROM categories WHERE name = 'Surgical Lights'), 120000.00, 6, 'Ceiling-mounted double-dome LED surgical light with shadowless illumination technology.', '/images/all-products/ot-light.jpg', 'EQUIPMENT', 
'{"Illumination Intensity": "160,000 + 120,000 Lux", "Color Temperature": "3800-4800K", "LED Service Life": "50,000 hours", "Focus Range": "120-300 mm"}', 
'["Shadowless technology", "Adjustable spot size", "Endo mode option", "Touch control panel"]'),

(17, 'Dental Chair', (SELECT id FROM categories WHERE name = 'Dental Chairs'), 180000.00, 5, 'Fully motor-driven ergonomic dental chair with integrated delivery unit and LED operating light.', '/images/all-products/dental-chair.jpg', 'EQUIPMENT', 
'{"Drive Motors": "DC 24V Quiet Motors", "Spittoon Type": "Rotatable Ceramic", "LED Sensor Light": "9000-33000 Lux", "Water System": "Purified water system"}', 
'["Programmable positions", "Integrated delivery unit", "LED sensor light", "Seamless PU upholstery"]'),

(18, 'Dialysis Machine', (SELECT id FROM categories WHERE name = 'Dialysis Machines'), 350000.00, 3, 'Advanced hemodialysis machine with blood volume monitoring and profiling.', '/images/all-products/dialysis.jpg', 'EQUIPMENT', 
'{"Blood Pump Flow": "15-500 ml/min", "Dialysate Flow": "300-800 ml/min", "Ultrafiltration Rate": "0-4000 ml/h", "Power Supply": "220V AC"}', 
'["Blood volume monitor", "Bicarbonate rinsing", "Self-test function", "Touchscreen interface"]'),

(19, 'Anesthesia Workstation', (SELECT id FROM categories WHERE name = 'Anesthesia Workstations'), 450000.00, 3, 'High-end anesthesia workstation with integrated ventilator and gas monitoring.', '/images/all-products/anesthesia.jpg', 'EQUIPMENT', 
'{"Ventilator Modes": "IPPV, SIPPV, IMV, PEP", "Vaporizer Mount": "Selectatec dual mount", "Flowmeter Type": "Electronic 4-tubes", "Gas Supply": "O2, N2O, Air"}', 
'["Integrated ventilator", "Electronic flowmeters", "Selectatec vaporizer mount", "Patient monitoring integration"]'),

(20, 'Suction Machine', (SELECT id FROM categories WHERE name = 'Suction Machines'), 15000.00, 15, 'Heavy-duty medical electric suction pump with dual 2.5L glass collection jars.', '/images/all-products/suction.jpg', 'EQUIPMENT', 
'{"Max Vacuum": "≥ 0.09 MPa", "Flow Rate": "≥ 40 L/min", "Noise Level": "≤ 60 dB(A)", "Bottle Capacity": "2.5 Liters x 2 Jars"}', 
'["High flow & high vacuum", "Oil-free lubrication pump", "Overflow protection valve", "Foot switch included"]'),

-- Spare Parts (IDs 21-44)
(21, 'ECG Cable', (SELECT id FROM categories WHERE name = 'ECG Cables'), 2500.00, 30, '10-lead medical grade ECG patient cable with gold-plated pins.', '/images/all-products/ecg-cable.jpg', 'SPARE_PART', 
'{"Lead Count": "10 Leads", "Connector": "DB-15 Pin Connector", "Length": "3.5 meters", "Style": "Banana plug"}', 
'["Shielded low-noise wire", "Molded stress relief", "Latex-free material", "Excellent signal transmission"]'),

(22, 'ECG Electrodes', (SELECT id FROM categories WHERE name = 'ECG Electrodes'), 150.00, 150, 'Standard snap-connector disposable ECG electrodes, pack of 50.', '/images/all-products/electrodes.jpg', 'SPARE_PART', 
'{"Quantity": "50 Electrodes/Pack", "Gel Type": "Conductive wet gel", "Connector": "Standard Snap", "Backing": "Foam"}', 
'["Wet gel conductivity", "Hypoallergenic foam backing", "Fast trace recovery", "Disposable"]'),

(23, 'X-Ray Tube', (SELECT id FROM categories WHERE name = 'X-Ray Tubes'), 85000.00, 3, 'Replacement rotating anode insert X-ray tube for radiography systems.', '/images/all-products/xray-tube.jpg', 'SPARE_PART', 
'{"Anode Type": "Rotating Anode", "Focal Spot Size": "0.6/1.2 mm", "Anode Heat Storage": "300 kHU", "Max Voltage": "150 kV"}', 
'["Rotating anode insert", "High heat capacity", "Durability under high loads", "Standard housing compatibility"]'),

(24, 'X-Ray Sensor', (SELECT id FROM categories WHERE name = 'X-Ray Sensors'), 65000.00, 5, 'Size 2 digital intraoral X-ray sensor for dental imaging.', '/images/all-products/xray-sensor.jpg', 'SPARE_PART', 
'{"Sensor Size": "Size 2 (Adult)", "Resolution": "20 lp/mm", "Interface": "USB 2.0 Direct", "Technology": "CMOS with Scintillator"}', 
'["Direct USB interface", "CMOS technology", "Waterproof IP68", "High-resolution diagnostic imaging"]'),

(25, 'Ultrasound Probe', (SELECT id FROM categories WHERE name = 'Ultrasound Probes'), 45000.00, 6, 'Replacement convex array transducer probe for abdominal imaging.', '/images/all-products/probe.jpg', 'SPARE_PART', 
'{"Probe Type": "Convex Array", "Frequency Range": "2.0-5.0 MHz", "Footprint": "60 mm radius", "Applications": "Abdominal, OB/GYN"}', 
'["Multi-frequency array", "Ergonomic case", "High density elements", "Universal connector plug"]'),

(26, 'Ventilator Filter', (SELECT id FROM categories WHERE name = 'Ventilator Filters'), 800.00, 100, 'Bacterial and viral HEPA breathing filter for mechanical ventilators.', '/images/all-products/filter.jpg', 'SPARE_PART', 
'{"Filter Efficiency": "99.999%", "Dead Space": "45 ml", "Resistance": "1.5 cm H2O at 30L/min", "Type": "Disposable HEPA"}', 
'["High bacterial/viral filtration", "Low flow resistance", "Standard 22mm connections", "Disposable item"]'),

(27, 'Ventilator Battery', (SELECT id FROM categories WHERE name = 'Ventilator Batteries'), 4500.00, 12, 'Rechargeable 24V Li-ion battery pack for transport ventilator power backup.', '/images/all-products/battery.jpg', 'SPARE_PART', 
'{"Voltage": "24 V", "Capacity": "4800 mAh", "Chemistry": "Lithium-ion", "Run Time": "Up to 4 hours"}', 
'["High capacity Li-ion", "Integrated charge monitoring", "Overcharge protection", "Compact transport design"]'),

(28, 'Patient Monitor Battery', (SELECT id FROM categories WHERE name = 'Patient Monitor Batteries'), 3500.00, 20, 'Replacement 11.1V rechargeable battery pack for bedside patient monitors.', '/images/all-products/monitor-battery.jpg', 'SPARE_PART', 
'{"Voltage": "11.1 V", "Capacity": "4400 mAh", "Chemistry": "Li-ion Pack", "Dimensions": "148x54x20 mm"}', 
'["Stable voltage delivery", "Short circuit protection", "Extended cycle life", "Easy drop-in replacement"]'),

(29, 'LCD Display', (SELECT id FROM categories WHERE name = 'LCD Displays'), 12000.00, 10, 'Replacement 12.1-inch TFT color LCD panel for medical monitors.', '/images/all-products/lcd.jpg', 'SPARE_PART', 
'{"Panel Size": "12.1 inch", "Resolution": "800x600 SVGA", "Interface": "LVDS 20-pin", "Backlight": "LED backlight"}', 
'["Bedside monitor compatible", "TFT active matrix", "LED backlight technology", "High brightness display"]'),

(30, 'Touch Screen Panel', (SELECT id FROM categories WHERE name = 'Touch Screen Panels'), 5000.00, 15, '4-wire resistive replacement touch panel digitizer for patient monitor screens.', '/images/all-products/touch.jpg', 'SPARE_PART', 
'{"Type": "4-Wire Resistive", "Diagonal Size": "12.1 inch", "Interface": "Flat Flex Cable", "Transparency": "≥ 80%"}', 
'["High scratch resistance", "Fast response touch digitizer", "Mylar adhesive frame included", "Bedside monitor replacement"]'),

(31, 'Power Supply Board', (SELECT id FROM categories WHERE name = 'Power Supply Boards'), 7500.00, 8, 'Integrated SMPS main power supply board for patient monitors.', '/images/all-products/psb.jpg', 'SPARE_PART', 
'{"Input Voltage": "100-240V AC", "Outputs": "+5V, +12V, +24V DC", "Power Rating": "120 Watts", "Protections": "OVP, OCP, SCP"}', 
'["Multi-voltage outputs", "Built-in line filters", "Low ripple noise", "Compact open frame layout"]'),

(32, 'Motherboard', (SELECT id FROM categories WHERE name = 'Motherboards'), 18000.00, 4, 'Main CPU controller motherboard for patient monitoring systems.', '/images/all-products/motherboard.jpg', 'SPARE_PART', 
'{"Processor": "ARM Cortex-A9", "RAM": "1 GB DDR3", "Storage": "4 GB eMMC", "Interfaces": "USB, Ethernet, VGA, LVDS"}', 
'["ARM processor technology", "Embedded real-time OS support", "Onboard diagnostic LEDs", "Gold-plated connectors"]'),

(33, 'Cooling Fan', (SELECT id FROM categories WHERE name = 'Cooling Fans'), 600.00, 40, 'Ultra-quiet 12V DC cooling fan with standard 3-pin connector.', '/images/all-products/fan.jpg', 'SPARE_PART', 
'{"Dimensions": "60x60x15 mm", "Voltage": "12V DC", "Speed": "3200 RPM", "Connector": "3-pin with PWM"}', 
'["Brushless DC motor", "Dual ball bearings", "Low noise operation", "Standard mounting holes"]'),

(34, 'Oxygen Sensor', (SELECT id FROM categories WHERE name = 'Oxygen Sensors'), 8000.00, 15, 'Electrochemical replacement oxygen sensor cell for ventilators and anesthesia loops.', '/images/all-products/o2-sensor.jpg', 'SPARE_PART', 
'{"Measurement Range": "0-100% O2", "Response Time": "< 12 seconds", "Connector": "3-pin modular jack", "Lifespan": "1,000,000% hours"}', 
'["Electrochemical sensor cell", "Fast response output", "Long operating life", "Temperature compensation onboard"]'),

(35, 'Pressure Sensor', (SELECT id FROM categories WHERE name = 'Pressure Sensors'), 3500.00, 20, 'Highly accurate differential air pressure sensor for ventilator circuits.', '/images/all-products/pressure-sensor.jpg', 'SPARE_PART', 
'{"Pressure Range": "-10 to +100 cmH2O", "Accuracy": "0.1 cmH2O", "Output": "I2C Digital Output", "Voltage": "5V DC"}', 
'["Differential pressure ports", "I2C digital communication", "High resolution readings", "PCB pin layout"]'),

(36, 'Valve Kit', (SELECT id FROM categories WHERE name = 'Valve Kits'), 4500.00, 10, 'Replacement solenoid valve assembly for medical gas mixing and delivery.', '/images/all-products/valves.jpg', 'SPARE_PART', 
'{"Valve Type": "2-Way Solenoid", "Coil Voltage": "12V DC", "Operating Pressure": "0-6 Bar", "Body Material": "Brass"}', 
'["Solenoid control valve", "Fast response activation", "High cycle life seals", "Compact manifolds"]'),

(37, 'Fuse Kit', (SELECT id FROM categories WHERE name = 'Fuse Kits'), 250.00, 50, 'Medical grade glass tube fuse assortment pack, including slow-blow fuses.', '/images/all-products/fuses.jpg', 'SPARE_PART', 
'{"Assortment": "50 Fuses (0.5A to 10A)", "Type": "Glass Tube 5x20mm", "Voltage Rating": "250V AC", "Response": "Slow-blow & Fast"}', 
'["Standard 5x20mm glass fuses", "Slow-blow & fast-acting range", "Safety certified", "Storage case included"]'),

(38, 'Transformer', (SELECT id FROM categories WHERE name = 'Transformers'), 3000.00, 8, 'Medical grade medical-isolation power transformer.', '/images/all-products/transformer.jpg', 'SPARE_PART', 
'{"Primary": "230V AC", "Secondary": "12V, 24V AC", "Power Rating": "150 VA", "Leakage Current": "< 10 uA"}', 
'["Toroidal isolation design", "Very low leakage current", "Thermal overload protection", "UL/CE certified"]'),

(39, 'Medical Grade Power Cable', (SELECT id FROM categories WHERE name = 'Power Cables'), 950.00, 50, 'Shielded medical grade mains power cable with hospital-grade plug.', '/images/all-products/power-cable.jpg', 'SPARE_PART', 
'{"Plug Type": "NEMA 5-15P (Hospital Grade)", "Connector": "IEC C13", "Length": "3.0 meters", "Rating": "15A / 125V"}', 
'["Hospital grade green-dot plug", "Heavy-duty shielding", "UL safety listed", "Flexible strain relief"]'),

(40, 'Foot Switch', (SELECT id FROM categories WHERE name = 'Foot Switches'), 3500.00, 15, 'Waterproof medical grade pneumatic foot switch with 3-meter cord.', '/images/all-products/footswitch.jpg', 'SPARE_PART', 
'{"Protection Class": "IPX8 (Waterproof)", "Contact Type": "SPDT NO/NC", "Cord Length": "3 meters", "Case Material": "Cast aluminum"}', 
'["Pneumatic/electric action", "Waterproof IPX8 rating", "Heavy-duty cast enclosure", "Anti-skid rubber base"]'),

(41, 'Handle Assembly', (SELECT id FROM categories WHERE name = 'Handle Assemblies'), 1200.00, 25, 'Replacement plastic handles and assembly parts for mobile monitors.', '/images/all-products/handle.jpg', 'SPARE_PART', 
'{"Material": "High-impact ABS", "Load Capacity": "30 kg", "Includes": "2 handles, screws", "Finish": "Matte white"}', 
'["High impact ABS plastic", "Ergonomic grip design", "Mounting hardware included", "Mobile cart compatible"]'),

(42, 'Wheel Kit', (SELECT id FROM categories WHERE name = 'Wheel Kits'), 1800.00, 15, 'Heavy-duty 3-inch caster wheels with lock brakes, set of 4.', '/images/all-products/wheels.jpg', 'SPARE_PART', 
'{"Caster Diameter": "3 inch", "Mount Type": "Threaded Stem M10", "Set Quantity": "4 (2 with Brakes)", "Weight Capacity": "120 kg/Set"}', 
'["Swivel caster wheels", "Non-marking polyurethane", "Integrated locking brakes", "Threaded stem mount"]'),

(43, 'Plastic Covers', (SELECT id FROM categories WHERE name = 'Plastic Covers'), 2500.00, 10, 'Replacement ABS plastic side covers for patient monitors.', '/images/all-products/covers.jpg', 'SPARE_PART', 
'{"Material": "ABS Flame Retardant", "Parts Included": "Left & Right covers", "Color": "Medical Gray", "Compatibility": "Sri Balaji Monitor Series"}', 
'["Flame retardant material", "Exact factory dimensions", "Color matched", "Snap-fit locking tabs"]'),

(44, 'Screws & Mounting Kit', (SELECT id FROM categories WHERE name = 'Mounting Kits'), 800.00, 40, 'Complete screw and mounting bracket kit for monitors and carts.', '/images/all-products/mounting-kit.jpg', 'SPARE_PART', 
'{"Includes": "VESA bracket, screws, spacers", "VESA Standard": "75x75 and 100x100 mm", "Material": "Power-coated steel", "Screw Sizes": "M4, M5, M6"}', 
'["Complete mounting kit", "VESA standard compliant", "Power-coated steel bracket", "All screws and spacers included"]')
ON DUPLICATE KEY UPDATE 
    name = VALUES(name),
    category_id = VALUES(category_id),
    price = VALUES(price),
    stock = VALUES(stock),
    description = VALUES(description),
    image_url = VALUES(image_url),
    product_type = VALUES(product_type),
    specifications = VALUES(specifications),
    features = VALUES(features);
