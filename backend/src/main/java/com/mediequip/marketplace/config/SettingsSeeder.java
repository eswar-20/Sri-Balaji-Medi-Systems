package com.mediequip.marketplace.config;

import com.mediequip.marketplace.entity.WebsiteSetting;
import com.mediequip.marketplace.repository.WebsiteSettingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class SettingsSeeder {

    @Autowired
    private WebsiteSettingRepository websiteSettingRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void seedSettings() {
        if (websiteSettingRepository.count() == 0) {
            Map<String, String> defaults = new HashMap<>();
            defaults.put("heroTitle", "Premium Medical Equipment Marketplace");
            defaults.put("bannerUrl", "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200");
            defaults.put("deliveryCharge", "500");
            defaults.put("gstRate", "18");
            defaults.put("contactEmail", "support@sribalajimedisystems.com");
            defaults.put("contactPhone", "+91 99480 73090");
            defaults.put("contactAddress", "Vijayawada, Andhra Pradesh, India");
            defaults.put("fbLink", "https://facebook.com/sribalaji");
            defaults.put("twitterLink", "https://twitter.com/sribalaji");
            defaults.put("aboutUs", "Sri Balaji Medi Systems is a leading supplier of high-end diagnostic, imaging, and hospital machinery across Andhra Pradesh.");
            defaults.put("privacyPolicy", "We protect your data under ISO 27001 compliance.");
            defaults.put("termsConditions", "All machinery installations are subject to standard verification protocols.");

            defaults.forEach((key, value) -> {
                websiteSettingRepository.save(new WebsiteSetting(key, value));
            });
            log.info("Default Website Settings successfully seeded!");
        }
    }
}
