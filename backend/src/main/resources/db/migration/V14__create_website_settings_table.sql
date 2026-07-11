CREATE TABLE website_settings (
    setting_key VARCHAR(255) PRIMARY KEY,
    setting_value TEXT
);

-- Seed initial parameters
INSERT INTO website_settings (setting_key, setting_value) VALUES 
('heroTitle', 'Premium Medical Equipment Marketplace'),
('bannerUrl', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'),
('deliveryCharge', '500'),
('gstRate', '18'),
('contactEmail', 'support@sribalajimedisystems.com'),
('contactPhone', '+91 99480 73090'),
('contactAddress', 'Vijayawada, Andhra Pradesh, India'),
('fbLink', 'https://facebook.com/sribalaji'),
('twitterLink', 'https://twitter.com/sribalaji'),
('aboutUs', 'Sri Balaji Medi Systems is a leading supplier of high-end diagnostic, imaging, and hospital machinery across Andhra Pradesh.'),
('privacyPolicy', 'We protect your data under ISO 27001 compliance.'),
('termsConditions', 'All machinery installations are subject to standard verification protocols.');
