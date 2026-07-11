package com.mediequip.marketplace.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mediequip.marketplace.entity.Category;
import com.mediequip.marketplace.entity.Product;
import com.mediequip.marketplace.entity.ProductType;
import com.mediequip.marketplace.repository.CategoryRepository;
import com.mediequip.marketplace.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Component
@Slf4j
public class ProductCatalogSeeder {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // The set of 27 existing images in the frontend/public/images/all-products folder
    private static final Set<String> EXISTING_IMAGES = new HashSet<>(Arrays.asList(
            "ECG Machine.jpg", "battery.jpg", "boyle.jpg", "bpl-108t-ecg-machine.png", "cautery.webp", "clamp.jpg",
            "ctg.jpg", "defib.webp", "doppler.jpg", "ecg-cable.jpg", "eye.png", "monitor.jpeg", "nibp.jpg",
            "ot-light.jpg", "ot-table.jpg", "oximeter.webp", "oxygen.webp", "paper.jpg", "pump.webp", "scan.webp",
            "spiro.webp", "spo2.jpg", "suction.jpg", "tag.jpg", "tmt.webp", "vein.jpg", "warmer.jpg"
    ));

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedCatalogIfEmpty() {
        log.info("Starting execution of idempotent ProductCatalogSeeder check...");

        // 1. Define and seed all default categories
        List<CategorySeed> categorySeeds = getCategorySeeds();
        for (CategorySeed cs : categorySeeds) {
            if (categoryRepository.findByName(cs.name).isEmpty()) {
                categoryRepository.save(Category.builder()
                        .name(cs.name)
                        .description(cs.description)
                        .productType(cs.type)
                        .build());
                log.info("Auto-healed and seeded missing Category: {}", cs.name);
            }
        }

        // 2. Define and seed all default 44 products
        List<ProductSeed> productSeeds = getProductSeeds();
        int seededCount = 0;
        for (ProductSeed ps : productSeeds) {
            Category category = categoryRepository.findByName(ps.categoryName)
                    .orElseThrow(() -> new RuntimeException("Category not found: " + ps.categoryName));

            // Check if product exists by ID
            Optional<Product> existingOpt = productRepository.findById(ps.id);

            Map<String, String> specs = null;
            List<String> feats = null;

            try {
                if (ps.specifications != null && !ps.specifications.trim().isEmpty()) {
                    specs = objectMapper.readValue(ps.specifications, new TypeReference<Map<String, String>>() {});
                }
                if (ps.features != null && !ps.features.trim().isEmpty()) {
                    feats = objectMapper.readValue(ps.features, new TypeReference<List<String>>() {});
                }
            } catch (Exception e) {
                log.warn("JSON parse warning for product {}: {}", ps.name, e.getMessage());
            }

            // Verify image path existence and redirect appropriately
            String correctedImageUrl = resolveImageUrl(ps.imageUrl);

            if (existingOpt.isPresent()) {
                Product existing = existingOpt.get();
                boolean updated = false;

                if (!existing.getName().equals(ps.name)) {
                    existing.setName(ps.name);
                    updated = true;
                }
                if (!existing.getCategory().getId().equals(category.getId())) {
                    existing.setCategory(category);
                    updated = true;
                }
                if (existing.getPrice().compareTo(new BigDecimal(ps.price)) != 0) {
                    existing.setPrice(new BigDecimal(ps.price));
                    updated = true;
                }
                if (existing.getStock() != ps.stock) {
                    existing.setStock(ps.stock);
                    updated = true;
                }
                if (!Objects.equals(existing.getDescription(), ps.description)) {
                    existing.setDescription(ps.description);
                    updated = true;
                }
                if (!Objects.equals(existing.getImageUrl(), correctedImageUrl)) {
                    existing.setImageUrl(correctedImageUrl);
                    updated = true;
                }
                if (existing.getProductType() != ps.type) {
                    existing.setProductType(ps.type);
                    updated = true;
                }

                if (updated) {
                    productRepository.save(existing);
                    log.info("Synchronized and updated Product properties: {} (ID: {})", ps.name, ps.id);
                }
            } else {
                productRepository.save(Product.builder()
                        .name(ps.name)
                        .category(category)
                        .price(new BigDecimal(ps.price))
                        .stock(ps.stock)
                        .description(ps.description)
                        .imageUrl(correctedImageUrl)
                        .productType(ps.type)
                        .specifications(specs)
                        .features(feats)
                        .enabled(true)
                        .deleted(false)
                        .build());

                seededCount++;
                log.info("Auto-healed and seeded missing Product: {}", ps.name);
            }
        }

        // Log final database validation statistics
        long totalProducts = productRepository.count();
        long equipmentCount = productRepository.findByProductTypeActive(com.mediequip.marketplace.entity.ProductType.EQUIPMENT).size();
        long sparePartsCount = productRepository.findByProductTypeActive(com.mediequip.marketplace.entity.ProductType.SPARE_PART).size();
        long totalCategories = categoryRepository.count();

        log.info("DATABASE AUDIT ON STARTUP:");
        log.info("Total products = {}", totalProducts);
        log.info("Equipment count = {}", equipmentCount);
        log.info("Spare parts count = {}", sparePartsCount);
        log.info("Categories count = {}", totalCategories);

        if (totalProducts < productSeeds.size()) {
            log.warn("WARNING: Products count ({}) is below the expected seeded catalog size ({})!", totalProducts, productSeeds.size());
        }

        if (seededCount > 0) {
            log.info("Completed seeder execution. Successfully auto-healed and seeded {} missing products.", seededCount);
        } else {
            log.info("Catalog validation checks passed successfully. Zero products required seeding.");
        }
    }

    private String resolveImageUrl(String originalUrl) {
        if (originalUrl == null || originalUrl.isEmpty()) {
            return "/images/placeholder.svg";
        }
        String imageName = originalUrl.substring(originalUrl.lastIndexOf("/") + 1);
        if (EXISTING_IMAGES.contains(imageName)) {
            return originalUrl;
        }

        // Apply redirection mapping rules for known files with differing extensions
        if (imageName.equals("defib.jpg")) {
            return "/images/all-products/defib.webp";
        } else if (imageName.equals("monitor.jpg")) {
            return "/images/all-products/monitor.jpeg";
        } else if (imageName.equals("pump.jpg")) {
            return "/images/all-products/pump.webp";
        } else if (imageName.equals("oxygen.jpg")) {
            return "/images/all-products/oxygen.webp";
        } else if (imageName.equals("oximeter.jpg")) {
            return "/images/all-products/oximeter.webp";
        } else if (imageName.equals("spiro.jpg")) {
            return "/images/all-products/spiro.webp";
        } else if (imageName.equals("boyle.jpg")) {
            return "/images/all-products/boyle.jpg";
        } else if (imageName.equals("xray.jpg")) {
            return "/images/all-products/scan.webp";
        }

        // Default fallback to placeholder
        return "/images/placeholder.svg";
    }

    private static class CategorySeed {
        String name;
        String description;
        ProductType type;

        CategorySeed(String name, String description, ProductType type) {
            this.name = name;
            this.description = description;
            this.type = type;
        }
    }

    private static class ProductSeed {
        Long id;
        String name;
        String categoryName;
        String price;
        int stock;
        String description;
        String imageUrl;
        ProductType type;
        String specifications;
        String features;

        ProductSeed(Long id, String name, String categoryName, String price, int stock, String description, String imageUrl,
                    ProductType type, String specifications, String features) {
            this.id = id;
            this.name = name;
            this.categoryName = categoryName;
            this.price = price;
            this.stock = stock;
            this.description = description;
            this.imageUrl = imageUrl;
            this.type = type;
            this.specifications = specifications;
            this.features = features;
        }
    }

    private List<CategorySeed> getCategorySeeds() {
        List<CategorySeed> list = new ArrayList<>();
        list.add(new CategorySeed("Diagnostic Equipment", "Medical devices for diagnosing conditions", ProductType.EQUIPMENT));
        list.add(new CategorySeed("Imaging Equipment", "Diagnostic imaging machines (MRI, X-Ray, CT, Ultrasound)", ProductType.EQUIPMENT));
        list.add(new CategorySeed("Critical Care & Ventilation", "ICU ventilators, anesthesia workstations, oxygen systems", ProductType.EQUIPMENT));
        list.add(new CategorySeed("Patient Monitoring", "Bedside monitors and fetal heart diagnostic devices", ProductType.EQUIPMENT));
        list.add(new CategorySeed("Infusion & Syringe Pumps", "Precision volumetric and syringe infusion devices", ProductType.EQUIPMENT));
        list.add(new CategorySeed("Surgical & OT Equipment", "Operating room tables, surgical lights, autoclaves, suction", ProductType.EQUIPMENT));
        list.add(new CategorySeed("Hospital Furniture", "Adjustable ICU beds, dental chairs, patient furniture", ProductType.EQUIPMENT));
        list.add(new CategorySeed("Renal Care", "Hemodialysis and renal support equipment", ProductType.EQUIPMENT));
        list.add(new CategorySeed("Medical Consumables", "Disposable consumables for diagnostic equipment", ProductType.EQUIPMENT));
        list.add(new CategorySeed("ECG Parts & Accessories", "Replacement cables, leads, and snap electrodes", ProductType.SPARE_PART));
        list.add(new CategorySeed("X-Ray Parts & Accessories", "Rotating anode X-Ray tubes, grids, and digital sensors", ProductType.SPARE_PART));
        list.add(new CategorySeed("Ultrasound Parts & Accessories", "Replacement transducers and convex probes", ProductType.SPARE_PART));
        list.add(new CategorySeed("Ventilator Parts & Accessories", "HEPA filters, Backup batteries, O2 sensors", ProductType.SPARE_PART));
        list.add(new CategorySeed("Monitor Parts & Accessories", "Bedside monitor batteries, replacement LCDs, touch panels", ProductType.SPARE_PART));
        list.add(new CategorySeed("Electronic & Power Components", "SMPS boards, main logic motherboards, transformers, cooling fans", ProductType.SPARE_PART));
        list.add(new CategorySeed("Surgical Parts & Accessories", "IPX8 foot pedals, handle assemblies, mount brackets", ProductType.SPARE_PART));
        list.add(new CategorySeed("Mechanical Components", "Caster caster wheels, plastic housings, screws", ProductType.SPARE_PART));
        return list;
    }

    private List<ProductSeed> getProductSeeds() {
        List<ProductSeed> list = new ArrayList<>();
        // Equipment (1-20)
        list.add(new ProductSeed(1L, "ECG Machine", "Diagnostic Equipment", "45000.00", 10,
                "12-channel diagnostic ECG machine with built-in thermal printer and interpretation software.",
                "/images/all-products/ECG Machine.jpg", ProductType.EQUIPMENT,
                "{\"Channels\": \"12\", \"Display\": \"7-inch Color LCD\", \"Printer\": \"Thermal Paper\", \"Battery\": \"Rechargeable Li-ion\"}",
                "[\"Auto-interpretation\", \"Built-in printer\", \"Battery backup\", \"Lightweight design\"]"));
        list.add(new ProductSeed(2L, "X-Ray Machine", "Imaging Equipment", "180000.00", 4,
                "High-frequency mobile X-Ray machine for diagnostic imaging in clinics and hospitals.",
                "/images/all-products/xray.jpg", ProductType.EQUIPMENT,
                "{\"Power Output\": \"5 kW\", \"kVp Range\": \"40-110 kV\", \"mA Range\": \"10-100 mA\", \"Type\": \"Mobile HF\"}",
                "[\"High frequency generator\", \"Digital control panel\", \"Compact mobility\", \"Low radiation leakage\"]"));
        list.add(new ProductSeed(3L, "MRI Scanner", "Imaging Equipment", "4500000.00", 2,
                "State-of-the-art 1.5T MRI scanner for high-resolution diagnostic imaging.",
                "/images/all-products/mri.jpg", ProductType.EQUIPMENT,
                "{\"Field Strength\": \"1.5 Tesla\", \"Bore Diameter\": \"60 cm\", \"Gradient Strength\": \"33 mT/m\", \"Helium Consumption\": \"Zero-boil-off\"}",
                "[\"Superconductive magnet\", \"High SNR coils\", \"Zero-boil-off technology\", \"Advanced clinical packages\"]"));
        list.add(new ProductSeed(4L, "CT Scanner", "Imaging Equipment", "3500000.00", 3,
                "High-speed 16-slice CT scanner for fast and accurate whole-body scanning.",
                "/images/all-products/ct.jpg", ProductType.EQUIPMENT,
                "{\"Slice Count\": \"16 Slices\", \"X-Ray Tube Capacity\": \"5.3 MHU\", \"Generator Power\": \"50 kW\", \"Rotation Speed\": \"0.5s\"}",
                "[\"Low dose technology\", \"High throughput\", \"3D reconstruction\", \"Intuitive console workflow\"]"));
        list.add(new ProductSeed(5L, "Ventilator", "Critical Care & Ventilation", "120000.00", 8,
                "Advanced ICU ventilator supporting both invasive and non-invasive ventilation modes.",
                "/images/all-products/ventilator.jpg", ProductType.EQUIPMENT,
                "{\"Modes\": \"VCV, PCV, SIMV, CPAP\", \"Display\": \"12.1-inch TFT Touchscreen\", \"Oxygen Sensor\": \"Paramagnetic\", \"Weight\": \"15 kg\"}",
                "[\"Invasive & Non-invasive\", \"Smart ventilation modes\", \"Integrated O2 monitoring\", \"Backup battery\"]"));
        list.add(new ProductSeed(6L, "Defibrillator", "Critical Care & Ventilation", "85000.00", 6,
                "Biphasic defibrillator and monitor with manual/AED modes and integrated printer.",
                "/images/all-products/defib.jpg", ProductType.EQUIPMENT,
                "{\"Energy Range\": \"2-360 Joules\", \"Modes\": \"Manual, AED, Pacing\", \"Display\": \"6.5-inch Color TFT\", \"Charge Time\": \"< 5 seconds\"}",
                "[\"Biphasic technology\", \"Pacing mode included\", \"Integrated thermal recorder\", \"SpO2 and NIBP options\"]"));
        list.add(new ProductSeed(7L, "Patient Monitor", "Patient Monitoring", "65000.00", 15,
                "Multi-parameter patient monitor tracking ECG, SpO2, NIBP, respiration, and temperature.",
                "/images/all-products/monitor.jpg", ProductType.EQUIPMENT,
                "{\"Parameters\": \"ECG, SpO2, NIBP, Resp, Temp\", \"Display\": \"12.1-inch LCD\", \"Battery Backup\": \"4 hours\", \"Trends\": \"168 hours\"}",
                "[\"Audible & visual alarms\", \"Central station networkable\", \"Arrhythmia analysis\", \"Built-in rechargeable battery\"]"));
        list.add(new ProductSeed(8L, "Syringe Pump", "Infusion & Syringe Pumps", "22000.00", 18,
                "Precision syringe driver with occlusion alarms and drug library compatibility.",
                "/images/all-products/syringe-pump.jpg", ProductType.EQUIPMENT,
                "{\"Syringe Size Compatibility\": \"10ml, 20ml, 30ml, 50/60ml\", \"Flow Rate Range\": \"0.1-1500 ml/h\", \"Accuracy\": \"±2%\", \"Occlusion Limit\": \"Adjustable\"}",
                "[\"Automatic syringe calibration\", \"Anti-bolus system\", \"Comprehensive alarm package\", \"Drug library pre-loaded\"]"));
        list.add(new ProductSeed(9L, "Infusion Pump", "Infusion & Syringe Pumps", "25000.00", 20,
                "Volumetric infusion pump for safe and accurate delivery of IV fluids and medications.",
                "/images/all-products/pump.jpg", ProductType.EQUIPMENT,
                "{\"Infusion Modes\": \"Rate, Time, Vol, Sequential\", \"Flow Rate Range\": \"0.1-1200 ml/h\", \"Drip Sensor\": \"Infrared\", \"Waterproof Rating\": \"IPX2\"}",
                "[\"Double CPU design\", \"Bubble detection\", \"Adjustable pressure levels\", \"Warm-up function\"]"));
        list.add(new ProductSeed(10L, "Ultrasound Machine", "Imaging Equipment", "250000.00", 5,
                "Color Doppler diagnostic ultrasound system with multi-frequency probe support.",
                "/images/all-products/ultrasound.jpg", ProductType.EQUIPMENT,
                "{\"Imaging Modes\": \"B, M, Color, PW, Power\", \"Monitor\": \"15-inch LED\", \"Probe Connectors\": \"3 active ports\", \"Hard Drive\": \"500 GB\"}",
                "[\"Color Doppler imaging\", \"3D/4D rendering option\", \"Digital beam former\", \"Multi-frequency probe support\"]"));
        list.add(new ProductSeed(11L, "Oxygen Concentrator", "Critical Care & Ventilation", "55000.00", 12,
                "High-capacity medical oxygen concentrator delivering up to 10 LPM pure oxygen.",
                "/images/all-products/oxygen.jpg", ProductType.EQUIPMENT,
                "{\"Flow Rate\": \"0.5-10 L/min\", \"O2 Concentration\": \"93% ±3%\", \"Outlet Pressure\": \"8.5 psi\", \"Power Consumption\": \"600W\"}",
                "[\"Low O2 purity alarm\", \"Continuous flow delivery\", \"Dual flow option\", \"Quiet operation < 48 dBA\"]"));
        list.add(new ProductSeed(12L, "Hospital Bed", "Hospital Furniture", "35000.00", 25,
                "Five-function electric ICU hospital bed with adjustable height and cardiac chair position.",
                "/images/all-products/bed.jpg", ProductType.EQUIPMENT,
                "{\"Drive System\": \"Electric (4 Linak Motors)\", \"Load Capacity\": \"250 kg\", \"Positions\": \"Backrest, Kneerest, Height, Trendelenburg\", \"Material\": \"ABS & Steel\"}",
                "[\"Linak motor system\", \"Cardiac chair position\", \"Central lock casters\", \"Battery backup\"]"));
        list.add(new ProductSeed(13L, "Operation Table", "Surgical & OT Equipment", "150000.00", 5,
                "Electro-hydraulic surgical operating table with C-arm compatibility and radiolucent top.",
                "/images/all-products/ot-table.jpg", ProductType.EQUIPMENT,
                "{\"Table Length\": \"2020 mm\", \"Table Width\": \"520 mm\", \"Height Range\": \"680-980 mm\", \"Trendelenburg Tilt\": \"±25°\"}",
                "[\"Electro-hydraulic drive\", \"C-arm compatible\", \"Rechargeable backup battery\", \"Split leg section\"]"));
        list.add(new ProductSeed(14L, "Autoclave", "Surgical & OT Equipment", "40000.00", 8,
                "Tabletop Class B steam sterilizer autoclave with pre-vacuum and dry cycles.",
                "/images/all-products/autoclave.jpg", ProductType.EQUIPMENT,
                "{\"Chamber Volume\": \"23 Liters\", \"Sterilization Temp\": \"121°C and 134°C\", \"Vacuum Pump\": \"Built-in double stage\", \"Water Tank Capacity\": \"4 Liters\"}",
                "[\"Class B pre-vacuum\", \"LCD cycle selection\", \"Thermal printer integrated\", \"Safety door interlock\"]"));
        list.add(new ProductSeed(15L, "ECG Electrodes Pack", "Medical Consumables", "1500.00", 100,
                "Bulk pack of 500 disposable solid-gel snap ECG electrodes for adults.",
                "/images/all-products/electrodes-pack.jpg", ProductType.EQUIPMENT,
                "{\"Quantity\": \"500 Electrodes/Pack\", \"Gel Type\": \"Solid conductive gel\", \"Backing\": \"Non-woven cloth\", \"Connector\": \"Standard Snap\"}",
                "[\"Hypoallergenic gel\", \"Strong adhesion\", \"Bulk packaging\", \"Excellent conductivity\"]"));
        list.add(new ProductSeed(16L, "Surgical Light", "Surgical & OT Equipment", "120000.00", 6,
                "Ceiling-mounted double-dome LED surgical light with shadowless illumination technology.",
                "/images/all-products/ot-light.jpg", ProductType.EQUIPMENT,
                "{\"Illumination Intensity\": \"160,000 + 120,000 Lux\", \"Color Temperature\": \"3800-4800K\", \"LED Service Life\": \"50,000 hours\", \"Focus Range\": \"120-300 mm\"}",
                "[\"Shadowless technology\", \"Shadowless LED field\", \"Ceiling suspension system\", \"Shadowless OT system\"]"));
        list.add(new ProductSeed(17L, "Dental Chair", "Hospital Furniture", "180000.00", 5,
                "Fully motor-driven ergonomic dental chair with integrated delivery unit and LED operating light.",
                "/images/all-products/dental-chair.jpg", ProductType.EQUIPMENT,
                "{\"Drive Motors\": \"DC 24V Quiet Motors\", \"Spittoon Type\": \"Rotatable Ceramic\", \"LED Sensor Light\": \"9000-33000 Lux\", \"Water System\": \"Purified water system\"}",
                "[\"Programmable positions\", \"Integrated delivery unit\", \"LED sensor light\", \"Seamless PU upholstery\"]"));
        list.add(new ProductSeed(18L, "Dialysis Machine", "Renal Care", "350000.00", 3,
                "Advanced hemodialysis machine with blood volume monitoring and profiling.",
                "/images/all-products/dialysis.jpg", ProductType.EQUIPMENT,
                "{\"Blood Pump Flow\": \"15-500 ml/min\", \"Dialysate Flow\": \"300-800 ml/min\", \"Ultrafiltration Rate\": \"0-4000 ml/h\", \"Power Supply\": \"220V AC\"}",
                "[\"Blood volume monitor\", \"Bicarbonate rinsing\", \"Self-test function\", \"Touchscreen interface\"]"));
        list.add(new ProductSeed(19L, "Anesthesia Workstation", "Critical Care & Ventilation", "450000.00", 3,
                "High-end anesthesia workstation with integrated ventilator and gas monitoring.",
                "/images/all-products/anesthesia.jpg", ProductType.EQUIPMENT,
                "{\"MockSpec\": \"Anesthesia specs\"}", "[\"Anesthesia features\"]"));
        list.add(new ProductSeed(20L, "Suction Machine", "Surgical & OT Equipment", "15000.00", 15,
                "Heavy-duty medical electric suction pump with dual 2.5L glass collection jars.",
                "/images/all-products/suction.jpg", ProductType.EQUIPMENT,
                "{\"Max Vacuum\": \"≥ 0.09 MPa\", \"Flow Rate\": \"≥ 40 L/min\", \"Noise Level\": \"≤ 60 dB(A)\", \"Bottle Capacity\": \"2.5 Liters x 2 Jars\"}",
                "[\"High flow & high vacuum\", \"Oil-free lubrication pump\", \"Overflow protection valve\", \"Foot switch included\"]"));

        // Spare Parts (21-44)
        list.add(new ProductSeed(21L, "ECG Cable", "ECG Parts & Accessories", "2500.00", 30,
                "10-lead medical grade ECG patient cable with gold-plated pins.",
                "/images/all-products/ecg-cable.jpg", ProductType.SPARE_PART,
                "{\"Lead Count\": \"10 Leads\", \"Connector\": \"DB-15 Pin Connector\", \"Length\": \"3.5 meters\", \"Style\": \"Banana plug\"}",
                "[\"Shielded low-noise wire\", \"Molded stress relief\", \"Latex-free material\", \"Excellent signal transmission\"]"));
        list.add(new ProductSeed(22L, "ECG Electrodes", "ECG Parts & Accessories", "150.00", 150,
                "Standard snap-connector disposable ECG electrodes, pack of 50.",
                "/images/all-products/electrodes.jpg", ProductType.SPARE_PART,
                "{\"Quantity\": \"50 Electrodes/Pack\", \"Gel Type\": \"Conductive wet gel\", \"Connector\": \"Standard Snap\", \"Backing\": \"Foam\"}",
                "[\"Wet gel conductivity\", \"Hypoallergenic foam backing\", \"Fast trace recovery\", \"Disposable\"]"));
        list.add(new ProductSeed(23L, "X-Ray Tube", "X-Ray Parts & Accessories", "85000.00", 3,
                "Replacement rotating anode insert X-ray tube for radiography systems.",
                "/images/all-products/xray-tube.jpg", ProductType.SPARE_PART,
                "{\"Anode Type\": \"Rotating Anode\", \"Focal Spot Size\": \"0.6/1.2 mm\", \"Anode Heat Storage\": \"300 kHU\", \"Max Voltage\": \"150 kV\"}",
                "[\"Rotating anode insert\", \"High heat capacity\", \"Durability under high loads\", \"Standard housing compatibility\"]"));
        list.add(new ProductSeed(24L, "X-Ray Sensor", "X-Ray Parts & Accessories", "65000.00", 5,
                "Size 2 digital intraoral X-ray sensor for dental imaging.",
                "/images/all-products/xray-sensor.jpg", ProductType.SPARE_PART,
                "{\"Sensor Size\": \"Size 2 (Adult)\", \"Resolution\": \"20 lp/mm\", \"Interface\": \"USB 2.0 Direct\", \"Technology\": \"CMOS with Scintillator\"}",
                "[\"Direct USB interface\", \"CMOS technology\", \"Waterproof IP68\", \"High-resolution diagnostic imaging\"]"));
        list.add(new ProductSeed(25L, "Ultrasound Probe", "Ultrasound Parts & Accessories", "45000.00", 6,
                "Replacement convex array transducer probe for abdominal imaging.",
                "/images/all-products/probe.jpg", ProductType.SPARE_PART,
                "{\"Probe Type\": \"Convex Array\", \"Frequency Range\": \"2.0-5.0 MHz\", \"Footprint\": \"60 mm radius\", \"Applications\": \"Abdominal, OB/GYN\"}",
                "[\"Multi-frequency array\", \"Ergonomic case\", \"High density elements\", \"Universal connector plug\"]"));
        list.add(new ProductSeed(26L, "Ventilator Filter", "Ventilator Parts & Accessories", "800.00", 100,
                "Bacterial and viral HEPA breathing filter for mechanical ventilators.",
                "/images/all-products/filter.jpg", ProductType.SPARE_PART,
                "{\"Filter Efficiency\": \"99.999%\", \"Dead Space\": \"45 ml\", \"Resistance\": \"1.5 cm H2O at 30L/min\", \"Type\": \"Disposable HEPA\"}",
                "[\"High bacterial/viral filtration\", \"Low flow resistance\", \"Standard 22mm connections\", \"Disposable item\"]"));
        list.add(new ProductSeed(27L, "Ventilator Battery", "Ventilator Parts & Accessories", "4500.00", 12,
                "Rechargeable 24V Li-ion battery pack for transport ventilator power backup.",
                "/images/all-products/battery.jpg", ProductType.SPARE_PART,
                "{\"Voltage\": \"24 V\", \"Capacity\": \"4800 mAh\", \"Chemistry\": \"Lithium-ion\", \"Run Time\": \"Up to 4 hours\"}",
                "[\"High capacity Li-ion\", \"Integrated charge monitoring\", \"Overcharge protection\", \"Compact transport design\"]"));
        list.add(new ProductSeed(28L, "Patient Monitor Battery", "Monitor Parts & Accessories", "3500.00", 20,
                "Replacement 11.1V rechargeable battery pack for bedside patient monitors.",
                "/images/all-products/monitor-battery.jpg", ProductType.SPARE_PART,
                "{\"Voltage\": \"11.1 V\", \"Capacity\": \"4400 mAh\", \"Chemistry\": \"Li-ion Pack\", \"Dimensions\": \"148x54x20 mm\"}",
                "[\"Stable voltage delivery\", \"Short circuit protection\", \"Extended cycle life\", \"Easy drop-in replacement\"]"));
        list.add(new ProductSeed(29L, "LCD Display", "Monitor Parts & Accessories", "12000.00", 10,
                "Replacement 12.1-inch TFT color LCD panel for medical monitors.",
                "/images/all-products/lcd.jpg", ProductType.SPARE_PART,
                "{\"Panel Size\": \"12.1 inch\", \"Resolution\": \"800x600 SVGA\", \"Interface\": \"LVDS 20-pin\", \"Backlight\": \"LED backlight\"}",
                "[\"Bedside monitor compatible\", \"TFT active matrix\", \"LED backlight technology\", \"High brightness display\"]"));
        list.add(new ProductSeed(30L, "Touch Screen Panel", "Monitor Parts & Accessories", "5000.00", 15,
                "4-wire resistive replacement touch panel digitizer for patient monitor screens.",
                "/images/all-products/touch.jpg", ProductType.SPARE_PART,
                "{\"Type\": \"4-Wire Resistive\", \"Diagonal Size\": \"12.1 inch\", \"Interface\": \"Flat Flex Cable\", \"Transparency\": \"≥ 80%\"}",
                "[\"High scratch resistance\", \"Fast response touch digitizer\", \"Mylar adhesive frame included\", \"Bedside monitor replacement\"]"));
        list.add(new ProductSeed(31L, "Power Supply Board", "Electronic & Power Components", "7500.00", 8,
                "Integrated SMPS main power supply board for patient monitors.",
                "/images/all-products/psb.jpg", ProductType.SPARE_PART,
                "{\"Input Voltage\": \"100-240V AC\", \"Outputs\": \"+5V, +12V, +24V DC\", \"Power Rating\": \"120 Watts\", \"Protections\": \"OVP, OCP, SCP\"}",
                "[\"Multi-voltage outputs\", \"Built-in line filters\", \"Low ripple noise\", \"Compact open frame layout\"]"));
        list.add(new ProductSeed(32L, "Motherboard", "Electronic & Power Components", "18000.00", 4,
                "Main CPU controller motherboard for patient monitoring systems.",
                "/images/all-products/motherboard.jpg", ProductType.SPARE_PART,
                "{\"Processor\": \"ARM Cortex-A9\", \"RAM\": \"1 GB DDR3\", \"Storage\": \"4 GB eMMC\", \"Interfaces\": \"USB, Ethernet, VGA, LVDS\"}",
                "[\"ARM processor technology\", \"Embedded real-time OS support\", \"Onboard diagnostic LEDs\", \"Gold-plated connectors\"]"));
        list.add(new ProductSeed(33L, "Cooling Fan", "Electronic & Power Components", "600.00", 40,
                "Ultra-quiet 12V DC cooling fan with standard 3-pin connector.",
                "/images/all-products/fan.jpg", ProductType.SPARE_PART,
                "{\"Dimensions\": \"60x60x15 mm\", \"Voltage\": \"12V DC\", \"Speed\": \"3200 RPM\", \"Connector\": \"3-pin with PWM\"}",
                "[\"Brushless DC motor\", \"Dual ball bearings\", \"Low noise operation\", \"Standard mounting holes\"]"));
        list.add(new ProductSeed(34L, "Oxygen Sensor", "Ventilator Parts & Accessories", "8000.00", 15,
                "Electrochemical replacement oxygen sensor cell for ventilators and anesthesia loops.",
                "/images/all-products/o2-sensor.jpg", ProductType.SPARE_PART,
                "{\"Measurement Range\": \"0-100% O2\", \"Response Time\": \"< 12 seconds\", \"Connector\": \"3-pin modular jack\", \"Lifespan\": \"1,000,000% hours\"}",
                "[\"Electrochemical sensor cell\", \"Fast response output\", \"Long operating life\", \"Temperature compensation onboard\"]"));
        list.add(new ProductSeed(35L, "Pressure Sensor", "Electronic & Power Components", "3500.00", 20,
                "Highly accurate differential air pressure sensor for ventilator circuits.",
                "/images/all-products/pressure-sensor.jpg", ProductType.SPARE_PART,
                "{\"Pressure Range\": \"-10 to +100 cmH2O\", \"Accuracy\": \"0.1 cmH2O\", \"Output\": \"I2C Digital Output\", \"Voltage\": \"5V DC\"}",
                "[\"Differential pressure ports\", \"I2C digital communication\", \"High resolution readings\", \"PCB pin layout\"]"));
        list.add(new ProductSeed(36L, "Valve Kit", "Electronic & Power Components", "4500.00", 10,
                "Replacement solenoid valve assembly for medical gas mixing and delivery.",
                "/images/all-products/valves.jpg", ProductType.SPARE_PART,
                "{\"Valve Type\": \"2-Way Solenoid\", \"Coil Voltage\": \"12V DC\", \"Operating Pressure\": \"0-6 Bar\", \"Body Material\": \"Brass\"}",
                "[\"Solenoid control valve\", \"Fast response activation\", \"High cycle life seals\", \"Compact manifolds\"]"));
        list.add(new ProductSeed(37L, "Fuse Kit", "Electronic & Power Components", "250.00", 50,
                "Medical grade glass tube fuse assortment pack, including slow-blow fuses.",
                "/images/all-products/fuses.jpg", ProductType.SPARE_PART,
                "{\"Assortment\": \"50 Fuses (0.5A to 10A)\", \"Type\": \"Glass Tube 5x20mm\", \"Voltage Rating\": \"250V AC\", \"Response\": \"Slow-blow & Fast\"}",
                "[\"Standard 5x20mm glass fuses\", \"Slow-blow & fast-acting range\", \"Safety certified\", \"Storage case included\"]"));
        list.add(new ProductSeed(38L, "Transformer", "Electronic & Power Components", "3000.00", 8,
                "Medical grade medical-isolation power transformer.",
                "/images/all-products/transformer.jpg", ProductType.SPARE_PART,
                "{\"Primary\": \"230V AC\", \"Secondary\": \"12V, 24V AC\", \"Power Rating\": \"150 VA\", \"Leakage Current\": \"< 10 uA\"}",
                "[\"Toroidal isolation design\", \"Very low leakage current\", \"Thermal overload protection\", \"UL/CE certified\"]"));
        list.add(new ProductSeed(39L, "Medical Grade Power Cable", "Electronic & Power Components", "950.00", 50,
                "Shielded medical grade mains power cable with hospital-grade plug.",
                "/images/all-products/power-cable.jpg", ProductType.SPARE_PART,
                "{\"Plug Type\": \"NEMA 5-15P (Hospital Grade)\", \"Connector\": \"IEC C13\", \"Length\": \"3.0 meters\", \"Rating\": \"15A / 125V\"}",
                "[\"Hospital grade green-dot plug\", \"Heavy-duty shielding\", \"UL safety listed\", \"Flexible strain relief\"]"));
        list.add(new ProductSeed(40L, "Foot Switch", "Surgical Parts & Accessories", "3500.00", 15,
                "Waterproof medical grade pneumatic foot switch with 3-meter cord.",
                "/images/all-products/footswitch.jpg", ProductType.SPARE_PART,
                "{\"Protection Class\": \"IPX8 (Waterproof)\", \"Contact Type\": \"SPDT NO/NC\", \"Cord Length\": \"3 meters\", \"Case Material\": \"Cast aluminum\"}",
                "[\"Pneumatic/electric action\", \"Waterproof IPX8 rating\", \"Heavy-duty cast enclosure\", \"Anti-skid rubber base\"]"));
        list.add(new ProductSeed(41L, "Handle Assembly", "Surgical Parts & Accessories", "1200.00", 25,
                "Replacement plastic handles and assembly parts for mobile monitors.",
                "/images/all-products/handle.jpg", ProductType.SPARE_PART,
                "{\"Material\": \"High-impact ABS\", \"Load Capacity\": \"30 kg\", \"Includes\": \"2 handles, screws\", \"Finish\": \"Matte white\"}",
                "[\"High impact ABS plastic\", \"Ergonomic grip design\", \"Mounting hardware included\", \"Mobile cart compatible\"]"));
        list.add(new ProductSeed(42L, "Wheel Kit", "Mechanical Components", "1800.00", 15,
                "Heavy-duty 3-inch caster wheels with lock brakes, set of 4.",
                "/images/all-products/wheels.jpg", ProductType.SPARE_PART,
                "{\"Caster Diameter\": \"3 inch\", \"Mount Type\": \"Threaded Stem M10\", \"Set Quantity\": \"4 (2 with Brakes)\", \"Weight Capacity\": \"120 kg/Set\"}",
                "[\"Swivel caster wheels\", \"Non-marking polyurethane\", \"Integrated locking brakes\", \"Threaded stem mount\"]"));
        list.add(new ProductSeed(43L, "Plastic Covers", "Monitor Parts & Accessories", "2500.00", 10,
                "Replacement ABS plastic side covers for patient monitors.",
                "/images/all-products/covers.jpg", ProductType.SPARE_PART,
                "{\"Material\": \"ABS Flame Retardant\", \"Parts Included\": \"Left & Right covers\", \"Color\": \"Medical Gray\", \"Compatibility\": \"Sri Balaji Monitor Series\"}",
                "[\"Flame retardant material\", \"Exact factory dimensions\", \"Color matched\", \"Snap-fit locking tabs\"]"));
        list.add(new ProductSeed(44L, "Screws & Mounting Kit", "Mechanical Components", "800.00", 40,
                "Complete screw and mounting bracket kit for monitors and carts.",
                "/images/all-products/mounting-kit.jpg", ProductType.SPARE_PART,
                "{\"Includes\": \"VESA bracket, screws, spacers\", \"VESA Standard\": \"75x75 and 100x100 mm\", \"Material\": \"Power-coated steel\", \"Screw Sizes\": \"M4, M5, M6\"}",
                "[\"Complete mounting kit\", \"VESA standard compliant\", \"Power-coated steel bracket\", \"All screws and spacers included\"]"));

        return list;
    }
}
