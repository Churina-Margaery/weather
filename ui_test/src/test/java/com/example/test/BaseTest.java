package com.example.test;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.Selenide;
import com.example.utils.MockUtil;
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
        Configuration.baseUrl = System.getProperty("selenide.baseUrl", "http://localhost:5173");
        Configuration.timeout = 10000;
        
        ChromeOptions options = new ChromeOptions();
        
        String userDataDir = "C:/temp/chrome-profile-" + System.currentTimeMillis();
        options.addArguments(
            "--user-data-dir=" + userDataDir,
            "--disable-dev-shm-usage",
            "--window-size=1366,768",
            "--no-sandbox"
        );
        
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.default_content_setting_values.automatic_downloads", 1);
        prefs.put("safebrowsing.enabled", true);
        options.setExperimentalOption("prefs", prefs);
        
        options.setExperimentalOption("excludeSwitches", 
            new String[]{"enable-automation", "load-extension"});
        
        Configuration.browserCapabilities = options;

        MockUtil.stubSpb();
        
        Selenide.open("/");
    }

    @AfterEach
    public void endJob() {
        clearBrowserCache();
        Selenide.closeWebDriver();
    }
}