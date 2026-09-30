-- V20: Expand image_url column in products to MEDIUMTEXT for direct image photo upload support
ALTER TABLE products MODIFY COLUMN image_url MEDIUMTEXT;
