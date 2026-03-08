package com.example.test;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.Selenide;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.chrome.ChromeOptions;
import java.util.HashMap;
import java.util.Map;
import static com.codeborne.selenide.Browsers.CHROME;
import static com.codeborne.selenide.WebDriverRunner.clearBrowserCache;

public class BaseTest {

    @BeforeEach
    public void setupConf() {
        Configuration.browser = CHROME;
        
        String baseUrl = System.getProperty("frontend.url", 
                         System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:8125"));
        Configuration.baseUrl = baseUrl;
        
        Configuration.timeout = 15000;
        
        boolean isCI = System.getenv("CI") != null || System.getenv("GITHUB_ACTIONS") != null;
        
        ChromeOptions options = new ChromeOptions();
        
        if (isCI) {
            String userDataDir = "/tmp/chrome-profile-" + System.currentTimeMillis();
            options.addArguments(
                "--user-data-dir=" + userDataDir,
                "--disable-dev-shm-usage",
                "--window-size=1366,768",
                "--no-sandbox",
                "--disable-gpu",
                "--headless=new"
            );
            Configuration.headless = true;
        } else {
            String userDataDir = System.getProperty("java.io.tmpdir") + "chrome-profile-" + System.currentTimeMillis();
            options.addArguments(
                "--user-data-dir=" + userDataDir,
                "--disable-dev-shm-usage",
                "--window-size=1366,768",
                "--no-sandbox",
                "--disable-gpu"
            );
            Configuration.headless = false;
        }
        
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.default_content_setting_values.automatic_downloads", 1);
        prefs.put("safebrowsing.enabled", true);
        options.setExperimentalOption("prefs", prefs);
        
        options.setExperimentalOption("excludeSwitches", 
            new String[]{"enable-automation", "load-extension"});
        
        Configuration.browserCapabilities = options;

        Selenide.open("/");
    }

    @AfterEach
    public void endJob() {
        clearBrowserCache();
        Selenide.closeWebDriver();
    }
}