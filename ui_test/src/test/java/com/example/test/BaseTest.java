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
        
        Configuration.timeout = 30000;
        Configuration.browserSize = "1366x768";
        
        // Определяем, запущены ли тесты в CI
        boolean isCI = System.getenv("CI") != null || System.getenv("GITHUB_ACTIONS") != null;
        
        ChromeOptions options = new ChromeOptions();
        
        // Базовые аргументы для всех окружений
        options.addArguments(
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--window-size=1366,768",
            "--remote-allow-origins=*"
        );
        
        if (isCI) {
            // Для CI - обязательный headless режим и путь к chromedriver
            System.setProperty("webdriver.chrome.driver", "/usr/local/bin/chromedriver");
            options.addArguments("--headless=new");
            options.addArguments("--disable-setuid-sandbox");
            options.addArguments("--disable-extensions");
            Configuration.headless = true;
            
            System.out.println("🔧 Running in CI mode with headless Chrome");
        } else {
            // Для локального запуска - обычный режим с браузером
            Configuration.headless = false;
            System.out.println("🔧 Running locally with visible Chrome");
        }
        
        // Добавляем prefs для избежания проблем
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