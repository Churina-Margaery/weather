package com.example.test;

import static com.github.tomakehurst.wiremock.client.WireMock.*;

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
        Configuration.baseUrl = "http://localhost:5173";
        Configuration.timeout = 10000; // Установка таймаута 10 секунд
        
        // Настройка W3C-совместимых опций Chrome
        ChromeOptions options = new ChromeOptions();
        
        // Уникальная папка профиля
        String userDataDir = "C:/temp/chrome-profile-" + System.currentTimeMillis();
        options.addArguments(
            "--user-data-dir=" + userDataDir,
            "--disable-dev-shm-usage",
            "--window-size=1366,768",
            "--no-sandbox"
        );
        
        // Настройка preferences
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.default_content_setting_values.automatic_downloads", 1);
        prefs.put("safebrowsing.enabled", true);
        options.setExperimentalOption("prefs", prefs);
        
        // Исключение определенных switches
        options.setExperimentalOption("excludeSwitches", 
            new String[]{"enable-automation", "load-extension"});
        
        // Установка W3C-совместимых capabilities
        Configuration.browserCapabilities = options;

        stubFor(get(urlPathEqualTo("/"))
        .withQueryParam("city_name", equalTo("Saint-Petersburg"))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-type", "application/json")
            .withHeader("Access-Control-Allow-Origin", "*")
            .withBodyFile("mocks/city_SPB.json")));

        stubFor(get(urlPathEqualTo("/forecast"))
        .withQueryParam("city_name", equalTo("Saint-Petersburg"))
        .willReturn(aResponse()
            .withStatus(200)
            .withHeader("Content-type", "application/json")
            .withHeader("Access-Control-Allow-Origin", "*")
            .withBodyFile("mocks/city_forecast_SPB.json")));

        Selenide.open("/");
    }

    @AfterEach
    public void endJob() {
        clearBrowserCache();
        Selenide.closeWebDriver();
    }
}