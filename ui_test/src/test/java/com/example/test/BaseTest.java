package com.example.test;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.Selenide;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.chrome.ChromeOptions;
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
            // Для CI - headless режим и путь к chromedriver
            System.setProperty("webdriver.chrome.driver", "/usr/local/bin/chromedriver");
            options.addArguments("--headless=new");
            Configuration.headless = true;
        } else {
            // Для локального запуска - обычный режим с браузером
            Configuration.headless = false;
        }
        
        Configuration.browserCapabilities = options;

        Selenide.open("/");
    }

    @AfterEach
    public void endJob() {
        clearBrowserCache();
        Selenide.closeWebDriver();
    }
}