package com.example.elements;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.openqa.selenium.By;
import static com.codeborne.selenide.Selectors.byXpath;
import static com.codeborne.selenide.Selenide.$;
import com.example.pages.LoadablePage;

public class AdditionalInfoBlock implements LoadablePage {
        private static final By windString = byXpath("//div[@data-testid = 'small-cards-container']/div[1]/div/h3");
        private static final By windValue = byXpath("//div[@data-testid = 'small-cards-container']/div[1]/div/h2");
        private static final By visibilityString = byXpath("//div[@data-testid = 'small-cards-container']/div[2]/div/h3");
        private static final By visibilityValue = byXpath("//div[@data-testid = 'small-cards-container']/div[2]/div/h2");
        private static final By pressureString = byXpath("//div[@data-testid = 'small-cards-container']/div[3]/div/h3");
        private static final By pressureValue = byXpath("//div[@data-testid = 'small-cards-container']/div[3]/div/h2");
        private static final By humidityString = byXpath("//div[@data-testid = 'small-cards-container']/div[4]/div/h3");
        private static final By humidityValue = byXpath("//div[@data-testid = 'small-cards-container']/div[4]/div/h2");
        private static final By sunriseString = byXpath("//div[@data-testid = 'small-cards-container']/div[5]/div/h3");
        private static final By sunriseValue = byXpath("//div[@data-testid = 'small-cards-container']/div[5]/div/h2");
        private static final By sunsetString = byXpath("//div[@data-testid = 'small-cards-container']/div[6]/div/h3");
        private static final By sunsetValue = byXpath("//div[@data-testid = 'small-cards-container']/div[6]/div/h2");

    public AdditionalInfoBlock() {
        checkUI();
    }

    @Override
    public boolean checkUI() {
        $(windString).isDisplayed();
        $(visibilityString).isDisplayed();
        $(pressureString).isDisplayed();
        $(humidityString).isDisplayed();
        $(sunriseString).isDisplayed();
        $(sunsetString).isDisplayed();
        return true;
    }

    public void checkWind() {
        $(windValue).scrollTo().isDisplayed();
    
        String actualWind = $(windValue).getText();
    
        assertFalse(actualWind.isEmpty(), "Ветер не отображается");
        assertTrue(actualWind.matches("\\d+(\\.\\d+)?\\s*km/h"), 
            "Неверный формат ветра: " + actualWind);
    }

    public void checkVisibility() {
        $(visibilityValue).scrollTo().isDisplayed();
    
        String actualVisibility = $(visibilityValue).getText();
    
        assertFalse(actualVisibility.isEmpty(), "Видимость не отображается");
        assertTrue(actualVisibility.matches("\\d+(\\.\\d+)?\\s*km"), 
            "Неверный формат видимости: " + actualVisibility);
    }

    public void checkPressure() {
        $(pressureValue).scrollTo().isDisplayed();
    
        String actualPressure = $(pressureValue).getText();
    
        assertFalse(actualPressure.isEmpty(), "Давление не отображается");
        assertTrue(actualPressure.matches("\\d+(\\.\\d+)?\\s*hPa"), 
            "Неверный формат давления: " + actualPressure);
    }

    public void checkHumidity() {
        $(humidityValue).scrollTo().isDisplayed();
    
        String actualHumidity = $(humidityValue).getText();
    
        assertFalse(actualHumidity.isEmpty(), "Влажность не отображается");
        assertTrue(actualHumidity.matches("\\d+(\\.\\d+)?\\s*%"), 
            "Неверный формат влажности: " + actualHumidity);
    }

    public void checkSunrise() {
        $(sunriseValue).scrollTo().isDisplayed();
    
        String actualSunrise = $(sunriseValue).getText();
    
        assertFalse(actualSunrise.isEmpty(), "Время восхода не отображается");
        assertTrue(actualSunrise.matches("([0-1]?[0-9]|2[0-3]):[0-5][0-9]"), 
            "Неверный формат времени восхода: " + actualSunrise);
    }

    public void checkSunset() {
        $(sunsetValue).scrollTo().isDisplayed();
    
        String actualSunset = $(sunsetValue).getText();
    
        assertFalse(actualSunset.isEmpty(), "Время заката не отображается");
        assertTrue(actualSunset.matches("([0-1]?[0-9]|2[0-3]):[0-5][0-9]"), 
            "Неверный формат времени заката: " + actualSunset);
    }
}
