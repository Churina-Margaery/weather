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
    
    ChromeOptions options = new ChromeOptions();
    
    // Минимальный набор аргументов для headless режима
    options.addArguments(
        "--headless=new",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--window-size=1366,768",
        "--remote-allow-origins=*"
    );
    
    options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
    
    Configuration.browserCapabilities = options;
    Configuration.headless = true;

    Selenide.open("/");
}

    @AfterEach
    public void endJob() {
        clearBrowserCache();
        Selenide.closeWebDriver();
    }
}